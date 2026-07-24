import { useState, useEffect } from 'react';
import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';

import { Card, Stack, Title, Loader } from '@mantine/core';
import { BarChart } from '@mantine/charts';

import { fetchConditionCounts } from '../services/syntheaApiService';
import { type PivotedConditionCount } from '../utils/types';
import {
  pivotByCondition,
  sortByTotalCount,
  limitTopNConditions,
} from '../utils/transforms';
import { APP_CONFIG } from '../config';
import classes from './ConditionsCountChartCard.module.css';
import CustomText from './CustomText';

/**
 * A card component that displays a bar chart of the top conditions by gender.
 */
export default function ConditionsCountChartCard() {
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>(
    'loading',
  );
  const [conditionCounts, setConditionCounts] = useState<
    PivotedConditionCount[] | null
  >(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchConditionCounts(APP_CONFIG.API_BASE_URL);

        if (data) {
          setStatus('success');
          const transformedData = limitTopNConditions(
            sortByTotalCount(pivotByCondition(data)),
            APP_CONFIG.LIMIT_TOP_N_CONDITIONS,
          );
          setConditionCounts(transformedData);
        } else {
          setStatus('error');
          console.warn('No condition counts data received from the API.');
        }
      } catch (error) {
        setStatus('error');
        console.error('Error fetching condition counts:', error);
      }
    };

    fetchData();
  }, [
    fetchConditionCounts,
    APP_CONFIG.API_BASE_URL,
    APP_CONFIG.LIMIT_TOP_N_CONDITIONS,
    pivotByCondition,
    sortByTotalCount,
    limitTopNConditions,
  ]);

  return (
    <Card className={classes.card} shadow="sm" radius="md" withBorder>
      <Stack justify="space-between" mb="xs">
        <Title order={2} mt="md" className={classes.cardTitle}>
          Top conditions by gender
        </Title>
        <CustomText>
          The 10 most common conditions overall, broken down by patient gender.
        </CustomText>
      </Stack>

      <Stack justify="center" align="center" mb="xs">
        {conditionCounts && (
          <BarChart
            data={conditionCounts}
            dataKey="condition_description"
            withLegend
            series={[
              { name: 'male', label: 'Male', color: 'blue.6' },
              { name: 'female', label: 'Female', color: 'red.6' },
            ]}
            orientation="vertical"
            className={classes.barChart}
            gridAxis="y"
            yAxisProps={{
              padding: { top: 20, bottom: 20 },
              width: 160,
            }}
            barProps={{ radius: 8 }}
            barChartProps={{ barCategoryGap: 12 }}
          />
        )}
        {status === 'loading' && (
          <Loader
            size="xl"
            type="dots"
            color="blue"
            style={{ marginTop: '20px' }}
          />
        )}
        {status === 'error' && (
          <CustomText c="red" mt="md" fw={600}>
            Error fetching condition counts. Please try again later.
          </CustomText>
        )}
      </Stack>
    </Card>
  );
}
