import { AppResult, succeed } from "@/util/result";

export async function getHealth(): Promise<AppResult<string>> {
  return succeed('OK');
}
