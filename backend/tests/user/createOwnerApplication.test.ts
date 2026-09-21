import fs from "node:fs";
import path from "node:path";
import supertest from "supertest";
import { describe, it, expect } from "vitest";
import app from "../../src/app.ts";
import { registerAndSubmit } from "../helper.ts";
import { type ApiResponse } from "@lankaStay/shared/utils/ApiResponse.ts";
import {
  APPLICATION_STATUS_TYPE,
  APPLICATION_STATUS,
} from "@lankaStay/shared/consts/applicationStatus.ts";
const api = supertest(app);
const endpoint = "/api/user/owner-application";
const cardImgPath = path.resolve(
  import.meta.dirname,
  "216-2164843_passport-png-free-download-passport-icon-png.webp",
);
const cardImg = fs.readFileSync(cardImgPath);

const applicationData = {
  firstName: "John",
  lastName: "Doe",
  address: "123 Main St, Anytown, USA",
  nationalNumber: "123456789",
  dateOfBirth: "1990-01-01",
};

describe("POST /api/user/owner-application", () => {
  it("should return 401 for unauthenticated user", async () => {
    const response = await api.post(endpoint).send({});
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("unauthorized user");
  });
  it("should return 200 for authenticated user ", async () => {
    const response = await registerAndSubmit(api, endpoint, applicationData, [
      { name: "cardImg", buffer: cardImg, filename: "card.webp" },
    ]);
    const responseBody = response.body as ApiResponse<{
      status: APPLICATION_STATUS_TYPE;
    }>;
    expect(response.status).toBe(200);
    expect(responseBody.data.status).toBe(APPLICATION_STATUS.PENDING);
  });

  it("should return 400 VALIDATION_ERROR when nationalNumber is too short", async () => {
    const response = await registerAndSubmit(
      api,
      endpoint,
      { ...applicationData, nationalNumber: "123" },
      [{ name: "cardImg", buffer: cardImg, filename: "card.webp" }],
    );
    expect(response.status).toBe(400);
    expect(response.body.code).toBe("VALIDATION_ERROR");
    expect(response.body.details).toHaveProperty("nationalNumber");
  });

  it("should return 400 VALIDATION_ERROR when a required field is missing", async () => {
    const { firstName, ...missing } = applicationData;
    const response = await registerAndSubmit(api, endpoint, missing, [
      { name: "cardImg", buffer: cardImg, filename: "card.webp" },
    ]);
    expect(response.status).toBe(400);
    expect(response.body.code).toBe("VALIDATION_ERROR");
    expect(response.body.details).toHaveProperty("firstName");
  });

  it("should return 400 VALIDATION_ERROR when the applicant is under 18", async () => {
    const response = await registerAndSubmit(
      api,
      endpoint,
      { ...applicationData, dateOfBirth: "2010-01-01" },
      [{ name: "cardImg", buffer: cardImg, filename: "card.webp" }],
    );
    expect(response.status).toBe(400);
    expect(response.body.code).toBe("VALIDATION_ERROR");
    expect(response.body.details.dateOfBirth).toContain(
      "at least 18 years old",
    );
  });

  it("should return 400 when no file is uploaded", async () => {
    const response = await registerAndSubmit(api, endpoint, applicationData);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("No files uploaded");
  });

  it("should return 400 when the image exceeds 5MB", async () => {
    const oversized = Buffer.alloc(5 * 1024 * 1024 + 1, 0xff);
    const response = await registerAndSubmit(api, endpoint, applicationData, [
      { name: "cardImg", buffer: oversized, filename: "big.webp" },
    ]);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("File too large");
  });

  it("should return 400 when more than one file is uploaded", async () => {
    const response = await registerAndSubmit(api, endpoint, applicationData, [
      { name: "cardImg", buffer: cardImg, filename: "card.webp" },
      { name: "cardImg", buffer: cardImg, filename: "card2.webp" },
    ]);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Too many files");
  });

  it("should return 400 when the file type is not accepted", async () => {
    const fakeImage = Buffer.from("this is definitely not an image", "utf-8");
    const response = await registerAndSubmit(api, endpoint, applicationData, [
      { name: "cardImg", buffer: fakeImage, filename: "card.webp" },
    ]);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid file type");
  });
});
