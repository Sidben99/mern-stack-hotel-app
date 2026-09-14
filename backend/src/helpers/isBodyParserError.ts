export default function isBodyParserError(error: Error) {
  const bodyParserCommonErrorsTypes = [
    "encoding.unsupported",
    "entity.parse.failed",
    "entity.verify.failed",
    "request.aborted",
    "request.size.invalid",
    "stream.encoding.set",
    "parameters.too.many",
    "charset.unsupported",
    "entity.too.large",
  ];
  if ("type" in error) {
    return bodyParserCommonErrorsTypes.includes(error.type as string)
      ? (error as Error & { status: number; type: string })
      : null;
  }
  return null;
}
