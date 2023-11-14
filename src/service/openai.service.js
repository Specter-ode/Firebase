import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  organization: process.env.NEXT_PUBLIC_OPENAI_ORG_KEY,
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export { openai };
