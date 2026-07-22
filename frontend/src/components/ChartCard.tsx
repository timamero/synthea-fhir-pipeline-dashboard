import { type ReactNode } from 'react';
import { Card } from '@mantine/core';

export default function ChartCard({ children }: { children: ReactNode }) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      {children}
    </Card>
  );
}
