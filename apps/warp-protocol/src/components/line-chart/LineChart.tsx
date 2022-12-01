import { Container, UIElementProps } from '@terra-money/apps/components';
import classNames from 'classnames';
import { Text } from 'components/primitives';
import { Chart } from 'react-chartjs-2';
import styles from './LineChart.module.sass';

type LineChartProps = UIElementProps & {
  data: number[];
  labels?: string[];
};

export const LineChart = (props: LineChartProps) => {
  const { className, data, labels } = props;

  const chartData = {
    labels: Array.from({ length: data.length }, () => 'A'),
    datasets: [
      {
        data: data,
        backgroundColor: '#C4C4C4',
        borderColor: '#C4C4C4',
        tension: 0.4,
        borderWidth: 1.5,
      },
    ],
  };
  return (
    <div className={classNames(className, styles.root)}>
      <div className={styles.container}>
        <Chart
          className={styles.chart}
          type="line"
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                enabled: false,
              },
            },
            elements: {
              point: {
                radius: 0,
              },
            },
            scales: {
              x: {
                display: false,
              },
              y: {
                display: false,
              },
            },
          }}
        />
      </div>
      {labels && (
        <Container direction="row" className={styles.labels}>
          {labels.map((l, index) => (
            <Text key={index} variant="text" className={styles.label}>
              {l}
            </Text>
          ))}
        </Container>
      )}
    </div>
  );
};
