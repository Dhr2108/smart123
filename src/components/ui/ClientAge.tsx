'use client';

import { useState, useEffect } from 'react';
import { calculateAge } from '@/lib/utils';

interface ClientAgeProps {
  dateOfBirth: string;
}

export function ClientAge({ dateOfBirth }: ClientAgeProps) {
  const [age, setAge] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: setting age in useEffect to avoid hydration mismatch
    setAge(calculateAge(dateOfBirth));
  }, [dateOfBirth]);

  if (age === null) {
    return <span>—</span>;
  }

  return <span>{age}</span>;
}