import { useState, useEffect } from 'react';
import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';

import { Card, Stack, Title, Text, Loader } from '@mantine/core';
import { BarChart } from '@mantine/charts';

import { fetchConditionCounts } from '../services/syntheaApiService';
import { type PivotedConditionCounts } from '../utils/types';
import {
  pivotByCondition,
  sortPivotedConditionCountsByGender,
  limitTopNConditions,
} from '../utils/transforms';

const LIMIT_TOP_N_CONDITIONS = 10;

/**
 * A card component that displays a bar chart of the top conditions by gender.
 */
export default function ConditionsCountChartCard() {
  const [conditionCounts, setConditionCounts] = useState<
    PivotedConditionCounts[] | null
  >(null);

  const baseUrl = 'http://localhost:8080';

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchConditionCounts(baseUrl);

      if (data) {
        const transformedData = limitTopNConditions(
          sortPivotedConditionCountsByGender(pivotByCondition(data)),
          LIMIT_TOP_N_CONDITIONS,
        );
        setConditionCounts(transformedData);
      } else {
        console.warn('No condition counts data received from the API.');
      }
    };

    fetchData();
  }, []);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack justify="space-between" mb="xs">
        <Title order={2} mt="md">
          Top conditions by gender
        </Title>
        <Text>
          The 10 most common conditions overall, broken down by patient gender.
        </Text>
      </Stack>

      <Stack justify="center" align="center" mb="xs">
        {conditionCounts ? (
          <BarChart
            data={conditionCounts}
            dataKey="condition_description"
            withLegend
            series={[
              { name: 'male', label: 'Male', color: 'blue.6' },
              { name: 'female', label: 'Female', color: 'red.6' },
            ]}
            orientation="vertical"
            h={600}
            w={600}
            gridAxis="y"
            yAxisProps={{
              padding: { top: 20, bottom: 20 },
              width: 180,
            }}
            barProps={{ radius: 8 }}
            barChartProps={{ barCategoryGap: 12 }}
          />
        ) : (
          <Loader
            size="xl"
            type="dots"
            color="blue"
            style={{ marginTop: '20px' }}
          />
        )}
      </Stack>
    </Card>
  );
}
