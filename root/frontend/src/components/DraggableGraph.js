import { Line } from 'react-chartjs-2';
import 'chartjs-plugin-dragdata';

const data = {
  labels: ['Thing 1', 'Thing 2', 'Thing 3', 'Thing 4', 'Thing 5'],
  datasets: [
    {
      label: 'Weights',
      data: [50, 50, 50, 50, 50],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
    },
  ],
};

const options = {
  scales: {
    r: {
      angleLines: {
        display: false,
      },
      min: 0,
      max: 100,
      stepSize: 1,
    },
  },

  plugins: {
    dragData: {
      magnet: {
        to: (value) => Math.round(value / 10) * 10,
      },
      onDrag: function (e, datasetIndex, index, value) {
        console.log(e, datasetIndex, index, value);
      },
      onDragStart: function (e, element) {
        console.log(e, element);
      },
      onDragEnd: function (e, datasetIndex, index, value) {
        console.log(e, datasetIndex, index, value);
      },
    },
  },
};

export function DraggableGraph() {
  return <Line data={data} options={options} type="radar" />;
}