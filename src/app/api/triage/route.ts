import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

function getClinicalRuleFallback(symptoms: string, age?: number, _gender?: string, _medicalHistory?: string) {
  const lower = symptoms.toLowerCase();

  if (
    lower.includes('chest pain') ||
    lower.includes('heart') ||
    lower.includes('unconscious') ||
    lower.includes('breathing difficulty') ||
    lower.includes('shortness of breath') ||
    lower.includes('severe bleeding') ||
    lower.includes('stroke') ||
    lower.includes('paralysis') ||
    lower.includes('seizure')
  ) {
    return {
      urgencyLevel: 'Emergency',
      urgencyScore: 9,
      possibleConditions: ['Acute Coronary Syndrome', 'Severe Respiratory Distress', 'Cerebrovascular Event'],
      recommendedDepartment: 'Emergency & Cardiology',
      recommendedActions: [
        'Immediate triage nurse evaluation',
        'Continuous vital sign & pulse oximetry monitoring',
        'Prepare 12-lead ECG and IV access',
        'Notify on-duty Emergency Physician immediately',
      ],
      additionalNotes: 'Critical symptoms detected. Immediate clinical intervention required. (Clinical rule engine; configure GEMINI_API_KEY for generative AI model)',
      shouldSeeDoctorImmediately: true,
    };
  }

  if (
    lower.includes('fracture') ||
    lower.includes('broken') ||
    lower.includes('high fever') ||
    lower.includes('head injury') ||
    lower.includes('deep cut') ||
    lower.includes('severe abdominal') ||
    lower.includes('vomiting blood')
  ) {
    return {
      urgencyLevel: 'Urgent',
      urgencyScore: 7,
      possibleConditions: ['Acute Trauma / Fracture', 'Severe Infection', 'Acute Abdominal Condition'],
      recommendedDepartment: lower.includes('fracture') || lower.includes('broken') ? 'Orthopedics' : 'Urgent Care / General Surgery',
      recommendedActions: [
        'Immobilize affected area if trauma suspected',
        'Administer antipyretic or analgesia per hospital protocol',
        'Order urgent X-ray or ultrasound',
        'Doctor evaluation within 30-45 minutes',
      ],
      additionalNotes: 'Urgent medical attention recommended. (Clinical rule engine; configure GEMINI_API_KEY for generative AI model)',
      shouldSeeDoctorImmediately: true,
    };
  }

  if (
    lower.includes('cough') ||
    lower.includes('fever') ||
    lower.includes('rash') ||
    lower.includes('headache') ||
    lower.includes('ear pain') ||
    lower.includes('throat') ||
    lower.includes('sprain')
  ) {
    const isPediatric = age !== undefined && age < 16;
    return {
      urgencyLevel: 'Semi-Urgent',
      urgencyScore: 5,
      possibleConditions: ['Upper Respiratory Infection', 'Viral Syndrome', 'Mild Musculoskeletal Strain'],
      recommendedDepartment: isPediatric ? 'Pediatrics' : (lower.includes('rash') ? 'Dermatology' : 'General Medicine'),
      recommendedActions: [
        'Record baseline vitals (temperature, blood pressure, SpO2)',
        'Symptomatic relief medication as indicated',
        'Schedule consultation with department specialist today',
      ],
      additionalNotes: 'Stable condition. Non-critical specialist or outpatient review advised.',
      shouldSeeDoctorImmediately: false,
    };
  }

  return {
    urgencyLevel: 'Non-Urgent',
    urgencyScore: 3,
    possibleConditions: ['Routine Consultation', 'General Health Assessment', 'Chronic Care Follow-up'],
    recommendedDepartment: 'General Medicine',
    recommendedActions: [
      'Standard outpatient clinic registration',
      'Routine diagnostic workup if requested',
      'Schedule regular clinic slot',
    ],
    additionalNotes: 'Condition is currently stable for routine outpatient consultation.',
    shouldSeeDoctorImmediately: false,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { symptoms, age, gender, medicalHistory } = body;

    if (!symptoms || !symptoms.trim()) {
      return NextResponse.json({ error: 'Symptoms are required' }, { status: 400 });
    }

    if (!GEMINI_API_KEY) {
      const triageResult = getClinicalRuleFallback(symptoms, age, gender, medicalHistory);
      return NextResponse.json({ triage: triageResult });
    }

    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

      const prompt = `You are a medical triage assistant in a hospital management system. Based on the following patient information, provide a triage assessment. Be professional and thorough.

Patient Information:
- Symptoms: ${symptoms}
${age ? `- Age: ${age}` : ''}
${gender ? `- Gender: ${gender}` : ''}
${medicalHistory ? `- Medical History: ${medicalHistory}` : ''}

Provide your response in the following JSON format only (no markdown, no code blocks):
{
  "urgencyLevel": "Emergency|Urgent|Semi-Urgent|Non-Urgent",
  "urgencyScore": <number 1-10>,
  "possibleConditions": ["condition1", "condition2", "condition3"],
  "recommendedDepartment": "department name",
  "recommendedActions": ["action1", "action2"],
  "additionalNotes": "any important notes",
  "shouldSeeDoctorImmediately": true/false
}`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // Parse the JSON response
      let triageResult;
      try {
        const cleaned = text.replace(/```json?\n?/g, '').replace(/```\n?/g, '').trim();
        triageResult = JSON.parse(cleaned);
      } catch {
        triageResult = {
          urgencyLevel: 'Semi-Urgent',
          urgencyScore: 5,
          possibleConditions: ['General Consultation Needed'],
          recommendedDepartment: 'General Medicine',
          recommendedActions: ['Consult with an on-duty physician'],
          additionalNotes: text,
          shouldSeeDoctorImmediately: false,
        };
      }

      return NextResponse.json({ triage: triageResult });
    } catch (aiError) {
      console.warn('Gemini AI failed, using clinical rule fallback:', aiError);
      const fallbackResult = getClinicalRuleFallback(symptoms, age, gender, medicalHistory);
      return NextResponse.json({ triage: fallbackResult });
    }
  } catch (error) {
    console.error('Triage error:', error);
    return NextResponse.json(
      { error: 'Failed to process triage request' },
      { status: 500 }
    );
  }
}
