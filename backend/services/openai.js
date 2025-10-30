import OpenAI from 'openai';

// HARDCODED OpenRouter configuration for free AI access
const OPENROUTER_API_KEY = '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';
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const AI_MODEL = 'deepseek/deepseek-chat'; // Current free DeepSeek model

// Initialize OpenRouter client
let aiClient = null;

const getAIClient = () => {
  if (!aiClient) {
    aiClient = new OpenAI({
      apiKey: OPENROUTER_API_KEY,
      baseURL: OPENROUTER_BASE_URL
    });

    console.log('✅ OpenRouter AI initialized (Free DeepSeek)');
  }
  return aiClient;
};

// Interview prompts based on type
const interviewPrompts = {
  behavioral: `You are a friendly technical interviewer conducting a behavioral interview.

CRITICAL RULES:
- Keep responses SHORT (2-3 sentences maximum)
- Ask ONE question at a time
- Have a natural conversation, not a lecture
- Listen and respond to what they actually say
- Use a conversational, warm tone
- Never write long paragraphs - be concise!

Ask about past experiences, teamwork, conflict resolution, and leadership.
Provide brief follow-ups based on their responses.`,

  technical: `You are a friendly technical interviewer conducting a technical interview.

CRITICAL RULES:
- Keep responses SHORT (2-3 sentences maximum)
- Ask ONE question at a time
- Have a natural conversation, not a lecture
- Listen and respond to what they actually say
- Use a conversational, warm tone
- Never write long paragraphs - be concise!
- If they struggle, give ONE small hint, don't explain everything

Ask about programming concepts, algorithms, data structures, and best practices.
Adapt based on their skill level.`,

  'system-design': `You are a friendly technical interviewer conducting a system design interview.

CRITICAL RULES:
- Keep responses SHORT (2-3 sentences maximum)
- Ask ONE question at a time
- Have a natural conversation, not a lecture
- Guide them with brief questions, not long explanations
- Use a conversational, warm tone
- Never write long paragraphs - be concise!

Ask about scalable systems, architecture decisions, and trade-offs.
Let them lead the design, you just guide with questions.`,

  coding: `You are a friendly technical interviewer conducting a coding interview.

CRITICAL RULES:
- Keep responses SHORT (2-3 sentences maximum)
- Ask ONE question at a time
- Have a natural conversation, not a lecture
- Listen and respond to what they actually say
- Use a conversational, warm tone
- Never write long paragraphs - be concise!
- If they're stuck, give ONE small hint

Present coding problems and discuss their approach.
Ask about complexity and edge cases naturally.`,

  mixed: `You are a friendly technical interviewer conducting a comprehensive interview.

CRITICAL RULES:
- Keep responses SHORT (2-3 sentences maximum)
- Ask ONE question at a time
- Have a natural conversation, not a lecture
- Mix different types of questions naturally
- Use a conversational, warm tone
- Never write long paragraphs - be concise!

Mix behavioral, technical, and problem-solving questions.
Adapt based on their responses and keep it flowing naturally.`
};

/**
 * Generate AI response for interview conversation
 */
export const generateAIResponse = async (messages, interviewType, difficulty) => {
  try {
    const systemPrompt = interviewPrompts[interviewType] || interviewPrompts.mixed;

    const difficultyContext = difficulty === 'easy'
      ? 'Keep questions appropriate for junior developers.'
      : difficulty === 'hard'
      ? 'Ask challenging questions appropriate for senior developers.'
      : 'Ask intermediate-level questions.';

    // Count actual conversation turns (exclude system messages)
    const conversationTurns = messages.filter(m => m.role !== 'system').length;
    const userResponses = messages.filter(m => m.role === 'user').length;

    // Determine if interview should be ending (after 8-12 exchanges)
    const shouldWrapUp = userResponses >= 8;
    const shouldEnd = userResponses >= 10;

    let additionalContext = '';
    if (shouldEnd) {
      additionalContext = '\n\nIMPORTANT: This is the LAST question. After their response, gracefully end the interview by thanking them and letting them know the session is complete. Keep it brief (1-2 sentences).';
    } else if (shouldWrapUp) {
      additionalContext = '\n\nThis interview is nearing its end. Ask one or two final meaningful questions.';
    }

    const formattedMessages = [
      {
        role: 'system',
        content: `${systemPrompt}\n\n${difficultyContext}\n\nBe encouraging, professional, and conversational.${additionalContext}`
      },
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    // If this is the first message, generate a greeting
    if (messages.length === 0 || (messages.length === 1 && messages[0].role === 'system')) {
      formattedMessages.push({
        role: 'user',
        content: 'Please start the interview with a brief, friendly greeting (1-2 sentences) and your first question.'
      });
    }

    const client = getAIClient();
    const completion = await client.chat.completions.create({
      model: AI_MODEL,
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 150, // Reduced from 500 to enforce shorter responses
      extra_headers: {
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "CodePrep AI"
      }
    });

    const response = completion.choices[0].message.content;

    // Return response with a flag indicating if interview should auto-end
    return {
      content: response,
      shouldAutoEnd: shouldEnd && userResponses > 10 // Auto-end after AI gives final response
    };
  } catch (error) {
    console.error('DeepSeek API error:', error);
    throw new Error('Failed to generate AI response');
  }
};

/**
 * Generate comprehensive feedback for completed interview
 */
export const generateInterviewFeedback = async (messages, interviewType) => {
  try {
    const conversation = messages
      .filter(msg => msg.role !== 'system')
      .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n\n');

    const feedbackPrompt = `Analyze the following ${interviewType} interview conversation and provide comprehensive feedback.

Interview Conversation:
${conversation}

Please provide:
1. An overall score (0-100)
2. Three key strengths of the candidate
3. Three areas for improvement
4. Individual scores (0-10) for:
   - Technical Skills
   - Communication
   - Problem Solving
5. Detailed feedback (2-3 paragraphs)
6. Three specific recommendations for the candidate

Format your response as JSON with this structure:
{
  "overallScore": number,
  "strengths": [string, string, string],
  "improvements": [string, string, string],
  "technicalSkills": number,
  "communication": number,
  "problemSolving": number,
  "detailedFeedback": string,
  "recommendations": [string, string, string]
}`;

    const client = getAIClient();
    const completion = await client.chat.completions.create({
      model: AI_MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are an expert technical interviewer providing constructive feedback. Be honest but encouraging.'
        },
        {
          role: 'user',
          content: feedbackPrompt
        }
      ],
      temperature: 0.5,
      max_tokens: 1000,
      response_format: { type: 'json_object' },
      extra_headers: {
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "CodePrep AI"
      }
    });

    const feedback = JSON.parse(completion.choices[0].message.content);
    return feedback;
  } catch (error) {
    console.error('OpenAI feedback error:', error);
    // Return default feedback if AI fails
    return {
      overallScore: 70,
      strengths: ['Good communication', 'Willing to learn', 'Problem-solving mindset'],
      improvements: ['Provide more detailed answers', 'Practice technical concepts', 'Think out loud more'],
      technicalSkills: 7,
      communication: 7,
      problemSolving: 7,
      detailedFeedback: 'The interview showed promise. Continue practicing and building your skills.',
      recommendations: [
        'Practice more coding problems',
        'Study system design patterns',
        'Work on explaining your thought process'
      ]
    };
  }
};

/**
 * Enhance resume using AI
 */
export const enhanceResume = async (resumeData) => {
  try {
    const prompt = `Enhance the following resume content to make it more impactful and professional.
    Improve the wording, add strong action verbs, and make achievements more quantifiable where possible.
    Maintain the original structure but improve the language and impact.

Resume Data:
${JSON.stringify(resumeData, null, 2)}

Return the enhanced resume in the same JSON format.`;

    const client = getAIClient();
    const completion = await client.chat.completions.create({
      model: AI_MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume writer and career coach.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
      extra_headers: {
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "CodePrep AI"
      }
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error('Resume enhancement error:', error);
    throw new Error('Failed to enhance resume');
  }
};
