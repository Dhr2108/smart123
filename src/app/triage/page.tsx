'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { triageApi } from '@/lib/api';
import {
  Sparkles,
  AlertTriangle,
  HeartPulse,
  Activity,
  CheckCircle2,
  Clock,
  ArrowRight,
  Stethoscope,
  ShieldAlert,
  RotateCcw,
  User,
  Calendar,
  AlertOctagon,
} from 'lucide-react';

interface TriageResult {
  urgencyLevel: 'Emergency' | 'Urgent' | 'Semi-Urgent' | 'Non-Urgent' | string;
  urgencyScore: number;
  possibleConditions: string[];
  recommendedDepartment: string;
  recommendedActions: string[];
  additionalNotes?: string;
  shouldSeeDoctorImmediately: boolean;
}

const PRESET_CASES = [
  {
    title: 'Cardiac Symptoms',
    symptoms: 'Crushing chest pressure radiating to left arm and jaw, diaphoresis, shortness of breath for 30 minutes',
    age: 58,
    gender: 'Male',
    medicalHistory: 'Hypertension, Dyslipidemia',
  },
  {
    title: 'Pediatric Fever',
    symptoms: 'High spike fever (103.5°F), lethargy, refusing oral fluids, persistent crying',
    age: 3,
    gender: 'Female',
    medicalHistory: 'None',
  },
  {
    title: 'Acute Asthma',
    symptoms: 'Severe wheezing, acute respiratory distress, SpO2 91% on room air, not responding to rescue inhaler',
    age: 24,
    gender: 'Female',
    medicalHistory: 'Bronchial Asthma',
  },
  {
    title: 'Trauma / Laceration',
    symptoms: 'Deep laceration on right forearm from broken glass, controlled venous oozing, full distal motor function',
    age: 35,
    gender: 'Male',
    medicalHistory: 'Tetanus shot 3 years ago',
  },
  {
    title: 'Routine Health Review',
    symptoms: 'Mild intermittent tension headaches, fatigue after work, requests routine blood work and blood pressure check',
    age: 42,
    gender: 'Male',
    medicalHistory: 'Mild anxiety',
  },
];

export default function TriagePage() {
  const [symptoms, setSymptoms] = useState('');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other' | ''>('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TriageResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePresetSelect = (preset: typeof PRESET_CASES[0]) => {
    setSymptoms(preset.symptoms);
    setAge(String(preset.age));
    setGender(preset.gender as 'Male' | 'Female' | 'Other');
    setMedicalHistory(preset.medicalHistory);
    setResult(null);
    setError(null);
  };

  const handleReset = () => {
    setSymptoms('');
    setAge('');
    setGender('');
    setMedicalHistory('');
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      setError('Please provide patient symptoms to perform triage.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await triageApi.analyze({
        symptoms: symptoms.trim(),
        age: age ? parseInt(age) : undefined,
        gender: gender || undefined,
        medicalHistory: medicalHistory.trim() || undefined,
      });

      setResult(response.triage as unknown as TriageResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Triage analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getUrgencyBadge = (level: string) => {
    switch (level) {
      case 'Emergency':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-red-100 text-red-800 border border-red-200 animate-pulse">
            <AlertOctagon className="h-3.5 w-3.5 text-red-600" />
            Emergency - Immediate Action
          </span>
        );
      case 'Urgent':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-amber-100 text-amber-800 border border-amber-200">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
            Urgent - Priority Care
          </span>
        );
      case 'Semi-Urgent':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-teal-100 text-teal-800 border border-teal-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800">
            <Activity className="h-3.5 w-3.5 text-teal-600 dark:text-emerald-400" />
            Semi-Urgent
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            Non-Urgent / Routine
          </span>
        );
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'bg-red-500';
    if (score >= 6) return 'bg-amber-500';
    if (score >= 4) return 'bg-teal-500';
    return 'bg-emerald-500';
  };

  return (
    <Layout
      title="AI Clinical Triage Assistant"
      headerActions={
        <div className="flex items-center gap-2">
          <Badge variant="info" className="gap-1.5 py-1 px-2.5">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            Powered by Gemini AI & Clinical Protocol
          </Badge>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-950 p-6 text-white shadow-lg border border-emerald-700/30">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-sm mb-3">
              <Stethoscope className="h-4 w-4" />
              Intelligent Intake & Acuity Scoring
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Clinical Triage & Decision Support
            </h1>
            <p className="mt-2 text-sm sm:text-base text-emerald-100/90 leading-relaxed">
              Evaluate presenting symptoms, calculate urgency scores, identify differential conditions, and route patients to the correct hospital department in seconds.
            </p>
          </div>
          <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
        </div>

        {/* Preset Quick Selectors */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
            Quick Clinical Scenarios (Click to test):
          </p>
          <div className="flex flex-wrap gap-2">
            {PRESET_CASES.map((preset) => (
              <button
                key={preset.title}
                type="button"
                onClick={() => handlePresetSelect(preset)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-emerald-900/40 bg-white dark:bg-black px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-800 dark:hover:text-emerald-300 transition-all shadow-sm"
              >
                <HeartPulse className="h-3.5 w-3.5 text-emerald-500" />
                {preset.title}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Patient Input Form */}
          <div className="lg:col-span-6 space-y-4">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-gray-900 flex items-center justify-between">
                  <span>Patient Intake Form</span>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs font-normal text-gray-500 hover:text-gray-900 flex items-center gap-1"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Reset
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAnalyze} className="space-y-4">
                  {error && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2">
                      <ShieldAlert className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Primary Symptoms */}
                  <div>
                    <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-1">
                      Chief Complaints & Symptoms <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="symptoms"
                      rows={4}
                      required
                      placeholder="e.g. Acute severe headache with photophobia and stiff neck starting 2 hours ago. Nausea and low grade fever."
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 dark:border-emerald-900/60 bg-white dark:bg-black text-gray-900 dark:text-white p-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  {/* Demographics Row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Age (Years)
                      </label>
                      <input
                        id="age"
                        type="number"
                        min="0"
                        max="125"
                        placeholder="e.g. 45"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 dark:border-emerald-900/60 bg-white dark:bg-black text-gray-900 dark:text-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                    <div>
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Gender
                      </label>
                      <select
                        id="gender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value as 'Male' | 'Female' | 'Other')}
                        className="w-full rounded-lg border border-gray-300 dark:border-emerald-900/60 bg-white dark:bg-black text-gray-900 dark:text-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      >
                        <option value="" className="bg-white dark:bg-black">Select Gender</option>
                        <option value="Male" className="bg-white dark:bg-black">Male</option>
                        <option value="Female" className="bg-white dark:bg-black">Female</option>
                        <option value="Other" className="bg-white dark:bg-black">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Medical History */}
                  <div>
                    <label htmlFor="medicalHistory" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Known Medical History / Allergies (Optional)
                    </label>
                    <input
                      id="medicalHistory"
                      type="text"
                      placeholder="e.g. Type 2 Diabetes, Penicillin Allergy, Prior CABG"
                      value={medicalHistory}
                      onChange={(e) => setMedicalHistory(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 dark:border-emerald-900/60 bg-white dark:bg-black text-gray-900 dark:text-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:text-black dark:hover:bg-emerald-400 gap-2 shadow-sm"
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Analyzing Clinical Acuity...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        <span>Generate Triage Assessment</span>
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Assessment Output / Cockpit */}
          <div className="lg:col-span-6 space-y-4">
            {result ? (
              <div className="space-y-4 animate-in fade-in duration-300">
                {/* Result Hero Header */}
                <Card className="border border-gray-200 dark:border-emerald-900/40 overflow-hidden shadow-md">
                  <div className="p-5 border-b border-gray-100 dark:border-emerald-900/30 bg-gradient-to-br from-white to-gray-50/50 dark:from-black dark:to-zinc-950">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                          Acuity Classification
                        </p>
                        {getUrgencyBadge(result.urgencyLevel)}
                      </div>
                      <div className="text-right sm:border-l sm:pl-4 border-gray-200 dark:border-emerald-900/30">
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Acuity Score</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-gray-900 dark:text-white">{result.urgencyScore}</span>
                          <span className="text-sm font-semibold text-gray-400">/ 10</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-zinc-800 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-700 ${getScoreColor(result.urgencyScore)}`}
                          style={{ width: `${Math.min(100, Math.max(10, result.urgencyScore * 10))}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-gray-500 dark:text-gray-400 mt-1 font-medium">
                        <span>1 (Routine)</span>
                        <span>5 (Moderate)</span>
                        <span>10 (Resuscitation)</span>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-5 space-y-4">
                    {/* Immediate Evaluation Alert */}
                    {result.shouldSeeDoctorImmediately && (
                      <div className="p-3.5 rounded-xl bg-red-50 dark:bg-rose-950/40 border border-red-200 dark:border-rose-900 text-red-900 dark:text-rose-200 flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-600 dark:text-rose-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-bold">Immediate Clinical Attention Required</p>
                          <p className="text-xs text-red-800 dark:text-rose-300 mt-0.5">
                            This patient displays high-risk signs. Escalate to the attending physician immediately.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Recommended Department */}
                    <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/70 dark:bg-emerald-950/40 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-emerald-600 dark:bg-emerald-500 text-white dark:text-black flex items-center justify-center font-bold">
                            <Stethoscope className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">Routing Department</p>
                            <p className="text-base font-bold text-gray-900 dark:text-white">{result.recommendedDepartment}</p>
                          </div>
                        </div>
                        <Link
                          href={`/appointments?department=${encodeURIComponent(result.recommendedDepartment)}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-white bg-white dark:bg-black px-3 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-700/60 hover:shadow-sm transition-all"
                        >
                          Book Appt
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>

                    {/* Possible Conditions */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2">
                        Potential Differential Conditions:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {result.possibleConditions?.map((cond, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center rounded-md bg-gray-100 dark:bg-zinc-900 px-2.5 py-1 text-xs font-medium text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-emerald-900/40"
                          >
                            {cond}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Clinical Actions */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2">
                        Recommended Immediate Actions:
                      </p>
                      <ul className="space-y-2">
                        {result.recommendedActions?.map((act, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Additional Notes */}
                    {result.additionalNotes && (
                      <div className="rounded-lg bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-emerald-900/30 p-3 text-xs text-gray-600 dark:text-gray-300">
                        <p className="font-semibold text-gray-700 dark:text-gray-200 mb-0.5">Clinical Notes:</p>
                        <p className="leading-relaxed">{result.additionalNotes}</p>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="pt-2 flex flex-col sm:flex-row gap-2">
                      <Link href="/appointments" className="flex-1">
                        <Button className="w-full text-xs font-semibold gap-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:text-black dark:hover:bg-emerald-400 text-white">
                          <Calendar className="h-3.5 w-3.5" />
                          Schedule Department Appointment
                        </Button>
                      </Link>
                      <Link href="/patients" className="flex-1">
                        <Button variant="outline" className="w-full text-xs font-semibold gap-2">
                          <User className="h-3.5 w-3.5" />
                          Register as New Patient
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              /* Idle state card */
              <Card className="border border-dashed border-gray-300 dark:border-emerald-900/40 bg-gray-50/50 dark:bg-zinc-950/40 min-h-[420px] flex items-center justify-center p-8 text-center">
                <div className="max-w-sm space-y-3">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    <Sparkles className="h-7 w-7" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">Awaiting Clinical Data</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    Fill in the patient symptoms on the left or click any preset clinical scenario above to generate an instant triage evaluation.
                  </p>
                  <div className="pt-2 flex items-center justify-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> &lt; 2s Analysis
                    </span>
                    <span className="flex items-center gap-1">
                      <Activity className="h-3 w-3" /> ESI Triage Standard
                    </span>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
