import OpenAI from "openai";
import { getEnv } from "../utils/generic/manage-env";

const openAIClient = new OpenAI({
  apiKey: getEnv("OPENAI_API_KEY"),
});

interface AIInput {
  role: "system" | "user" | "assistant";
  content: string;
}

async function generateAiResponse(
  messages: AIInput[],
  model: string = "gpt-4o"
): Promise<string> {
  try {
    const chatCompletion = await openAIClient.chat.completions.create({
      messages,
      model,
    });

    return chatCompletion.choices[0].message.content || "No response";
  } catch (error) {
    console.error("Error generating response:", error);
    return "Error fetching response";
  }
}

export async function generateQuestions(
  marks: number,
  difficulty_level: "easy" | "medium" | "hard",
  lessons: string[]
) {
  const messages: AIInput = {
    role: "system",
    content: `Act as an Exam Test Preparation Master for School Students in India.Below is the content from which I want to conduct a test for around ${marks} marks with a difficulty level of ${difficulty_level}.Generate the following types of questions: Multiple Choice Questions (MCQs),Short Answer Questions,Fill in the Blanks.Ensure that the questions are well-distributed across different concepts covered in the provided content.
    expected output:{"mcq": [{"question": "What is the capital of India?","options": ["Mumbai", "Delhi", "Kolkata","Chennai"]}],"fill_in_the_blanks":["The process of converting water into vapor is called _______."],"short_answers":["Explain the process of photosynthesis in brief."]}.Use the following content as the base for generating questions: ${lessons.join(
      "."
    )}`,
  };

  const response = await generateAiResponse([messages]);
  try {
    const cleanedResponse = response
      .trim()
      .replace(/^```json/, "")
      .replace(/```$/, "")
      .trim();

    const jsonResponse = JSON.parse(cleanedResponse);

    console.log(`**************************************`);
    console.log(jsonResponse);
    console.log(`**************************************`);

    return jsonResponse;
  } catch (error) {
    console.error("Error parsing JSON response:", error);
    return { error: "Invalid JSON response" };
  }
}

export async function generateSyllabusPlanner(
  topic: string,
  subtopics: string[],
  timePeriod: string,
  startDate?: string,
  endDate?: string
): Promise<any> {
  const prompt = `You are an expert educator tasked with creating a detailed syllabus planner in JSON format. Use the following information to generate a structured syllabus plan:
    - **Topic:** ${topic}
    - **Subtopics:** ${subtopics.join(", ")}
    - **Time Period:** ${timePeriod}
    - **Optional Actual Dates:**
      - **Start Date:** ${startDate || "Not specified"}
      - **End Date:** ${endDate || "Not specified"}
    **Instructions:**
    1. **Structure the Syllabus:** Organize the syllabus into weekly or bi-weekly modules, depending on the time period.
    2. **Allocate Time:** Distribute the subtopics evenly across the modules, ensuring each subtopic gets adequate coverage.
    3. **Include Learning Objectives:** For each module, specify what students should be able to do or understand by the end of the module.
    4. **Suggest Activities and Assessments:** Propose activities (e.g., lectures, discussions, projects) and assessments (e.g., quizzes, assignments) for each module.
    5. **Additional Resources:** Recommend supplementary materials like readings, videos, or tools that can aid learning.
    6. **Optional Dates:** If actual dates are provided, align the modules with these dates.
    **Example Output (JSON format):**
    {
      "topic": "[Topic]",
      "timePeriod": "[Time Period]",
      "startDate": "[Start Date]",
      "endDate": "[End Date]",
      "modules": [
        {
          "module": "Module 1: Introduction to [Topic]",
          "week": "Week 1",
          "subtopic": "[Subtopic 1]",
          "learningObjectives": ["Objective 1", "Objective 2"],
          "activities": ["Lecture", "Discussion"],
          "assessments": ["Quiz", "Assignment"],
          "additionalResources": ["Reading 1", "Video 1"]
        }
      ]
    }
    **Note:** Ensure the JSON structure is coherent, logical, and aligns with educational best practices.
  `;

  const messages: AIInput[] = [{ role: "system", content: prompt }];

  const response = await generateAiResponse(messages);

  console.log(`**************************************`);
  console.log(response, "response before cleaning");
  console.log(`**************************************`);

  try {
    const cleanedResponse = response
      .trim()
      .replace(/^```json/, "")
      .replace(/```$/, "")
      .trim();

    const jsonResponse = JSON.parse(cleanedResponse);

    return jsonResponse;
  } catch (error) {
    console.error("Error parsing JSON response:", error);
    return { error: "Invalid JSON response" };
  }
}
