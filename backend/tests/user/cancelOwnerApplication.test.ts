import fs from "node:fs";
import path from "node:path";
import supertest from "supertest";
import { describe, it, expect } from "vitest";
import app from "../../src/app.ts";
import { registerTestUser } from "../helper.ts";
import { UserModel } from "../../src/models/User.model.ts";
import { APPLICATION_STATUS } from "@lankaStay/shared/consts/applicationStatus.ts";
const api = supertest(app);
const cancelEndpoint = "/api/user/become-owner/cancel";
const becomeOwnerEndpoint = "/api/user/become-owner";
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

async function registerUser() {
  const { registerResponseBody } = await registerTestUser(api);
  return {
    accessToken: registerResponseBody.data.accessToken,
    userId: registerResponseBody.data.user.id,
  };
}

async function submitApplication(accessToken: string) {
  const response = await api
    .post(becomeOwnerEndpoint)
    .set("Authorization", `Bearer ${accessToken}`)
    .field(applicationData)
    .attach("cardImg", cardImg, "card.webp");
  expect(response.status).toBe(200);
}

async function setApplicationStatus(userId: string, status: string) {
  await UserModel.updateOne(
    { _id: userId },
    { $set: { "ownerInfo.applicationStatus": status } },
  );
}

describe("POST /api/user/become-owner/cancel", () => {
  it("should return 401 for unauthenticated user", async () => {
    const response = await api.post(cancelEndpoint).send({});
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("unauthorized user");
  });

  it("should cancel a pending application and return the updated user", async () => {
    const { accessToken } = await registerUser();
    await submitApplication(accessToken);

    const response = await api
      .post(cancelEndpoint)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.user.ownerInfo.applicationStatus).toBe(
      APPLICATION_STATUS.CANCELLED,
    );
  });

  it("should not leak credentials in the response", async () => {
    const { accessToken } = await registerUser();
    await submitApplication(accessToken);

    const response = await api
      .post(cancelEndpoint)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.user).not.toHaveProperty("password");
    expect(response.body.data.user).not.toHaveProperty("tokens");
    expect(response.body.data.user).not.toHaveProperty("resetPasswordToken");
  });

  it("should return 404 when the user does not exist", async () => {
    const { accessToken, userId } = await registerUser();
    await UserModel.deleteOne({ _id: userId });

    const response = await api
      .post(cancelEndpoint)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("user not found");
  });

  it("should return 400 for an approved application", async () => {
    const { accessToken, userId } = await registerUser();
    await setApplicationStatus(userId, APPLICATION_STATUS.APPROVED);

    const response = await api
      .post(cancelEndpoint)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(400);
  });

  it("should return 400 for a rejected application", async () => {
    const { accessToken, userId } = await registerUser();
    await setApplicationStatus(userId, APPLICATION_STATUS.REJECTED);

    const response = await api
      .post(cancelEndpoint)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(400);
  });

  it("should return 400 for an already cancelled application", async () => {
    const { accessToken, userId } = await registerUser();
    await setApplicationStatus(userId, APPLICATION_STATUS.CANCELLED);

    const response = await api
      .post(cancelEndpoint)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(400);
  });

  it("should return 400 when the user has no application", async () => {
    const { accessToken } = await registerUser();

    const response = await api
      .post(cancelEndpoint)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(400);
  });

  it("should allow exactly one concurrent cancel to succeed", async () => {
    const { accessToken, userId } = await registerUser();
    await setApplicationStatus(userId, APPLICATION_STATUS.PENDING);

    const [first, second] = await Promise.all([
      api.post(cancelEndpoint).set("Authorization", `Bearer ${accessToken}`),
      api.post(cancelEndpoint).set("Authorization", `Bearer ${accessToken}`),
    ]);

    expect([first.status, second.status].sort()).toEqual([200, 400]);

    const updated = await UserModel.findById(userId);
    expect(updated?.ownerInfo?.applicationStatus).toBe(
      APPLICATION_STATUS.CANCELLED,
    );
  });
});