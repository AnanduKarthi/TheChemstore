const { GoogleGenerativeAI } = require('@google/generative-ai');

let model;

const getModel = () => {
  if (!model) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // gemini-1.5-flash: fast + cheap — ideal for batch classification
    model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }
  return model;
};

const BATCH_SIZE = 10;

const enrichBatch = async (jobs) => {
  const input = jobs.map((j, idx) => ({
    idx,
    title: j.title,
    // Cap description to ~400 chars to save tokens
    description: (j.description || '').substring(0, 400),
    skills: j.skills?.slice(0, 10),
  }));

  const prompt = `You are a chemistry job categorization assistant.

For each job below, extract exactly:
1. chemistryField — one of: organic | inorganic | analytical | physical | biochemistry | polymer | medicinal | environmental | industrial | food | materials | computational | other
2. experienceLevel — one of: intern | entry | mid | senior | lead | manager | other
3. skills — array of up to 10 relevant chemistry/technical skills mentioned or implied

Respond ONLY with a valid JSON array, no markdown, no explanation:
[{"idx":0,"chemistryField":"...","experienceLevel":"...","skills":[...]}]

Jobs:
${JSON.stringify(input)}`;

  const result = await getModel().generateContent(prompt);
  const text = result.response.text().trim();

  // Extract JSON array from response
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    console.error('[JobEnricher] Could not parse Gemini response:', text.substring(0, 200));
    return jobs;
  }

  const enrichments = JSON.parse(jsonMatch[0]);

  return jobs.map((job, idx) => {
    const e = enrichments.find((x) => x.idx === idx);
    if (!e) return job;
    return {
      ...job,
      chemistryField: e.chemistryField || 'other',
      experienceLevel: e.experienceLevel || 'other',
      skills: [...new Set([...(job.skills || []), ...(e.skills || [])])],
    };
  });
};

const enrichJobs = async (jobs) => {
  const enriched = [];

  for (let i = 0; i < jobs.length; i += BATCH_SIZE) {
    const batch = jobs.slice(i, i + BATCH_SIZE);
    try {
      const result = await enrichBatch(batch);
      enriched.push(...result);
    } catch (err) {
      console.error(`[JobEnricher] Batch ${i / BATCH_SIZE + 1} failed:`, err.message);
      // Push un-enriched jobs rather than losing them
      enriched.push(...batch);
    }
    // Brief pause between Gemini calls
    if (i + BATCH_SIZE < jobs.length) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  return enriched;
};

module.exports = { enrichJobs };
