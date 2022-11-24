import { Container, UIElementProps } from 'shared/components';
import classNames from 'classnames';
import { Text } from 'components/primitives';
import { Chart } from 'react-chartjs-2';
import styles from './BarChart.module.sass';

type BarChartProps = UIElementProps & {
  data: number[];
  labels?: string[];
};

export const BarChart = (props: BarChartProps) => {
  const { className, data, labels } = props;

  const chartData = {
    labels: Array.from({ length: data.length }, () => 'A'),
    datasets: [
      {
        data: data,
        backgroundColor: '#D1E3FB',
      },
    ],
  };
  return (
    <div className={classNames(className, styles.root)}>
      <div className={styles.container}>
        <Chart
          className={styles.chart}
          type="bar"
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
