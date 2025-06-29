import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LineChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import { Circle, G, Text } from 'react-native-svg';

interface PimpleData {
  date: string;
  number_of_b: number;
}

interface PimpleChartProps {
  data: PimpleData[];
}

const PimpleChart: React.FC<PimpleChartProps> = ({ data }) => {
  // Extract y-values (npimples) and x-values (dates)
  const pimples = data.map((item) => item.number_of_b);
  const dates = data.map((item) => item.date);

  // Custom dots
  const CustomDots = ({ x, y }) => {
    return pimples.map((value, index) => {
      // Log the x and y coordinates for debugging
      
      return (
        <Circle
          key={index}
          cx={x(index)} // Map x position using the index
          cy={y(value)} // Map y position using the value
          r={4}
          stroke="red"
          fill="black"
        />
      );
    });
  };  

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        {/* Y-Axis */}
        <YAxis
          data={pimples}
          style={styles.yAxis}
          contentInset={{ top: 20, bottom: 15 }}
          svg={{
            fontSize: 10,
            fontweight: 'bold',
            fill: 'black',
          }}
          formatLabel={(value, index) => {
            // Display only every 2nd value for example (adjust the number for your needs)
            return index % 2 === 0 ? `${value}` : ''; // Shows only every 2nd label
          }}
        />
        <View style={styles.lineChartContainer}>
          {/* Line Chart */}
          <LineChart
            style={styles.lineChart}
            data={pimples}
            svg={{ stroke: 'rgba(66, 3, 61, 1)', strokeWidth: 3 }}
            contentInset={{ top: 30, bottom: 15, left: 15 }}
            curve={shape.curveMonotoneX}
          >
            {({ x, y }) => {
              return (
                <Circle
                  key={0} // Test with a single dot, just for debugging
                  cx={x(0)} // Use x(0) to get the first data point's x-coordinate
                  cy={y(pimples[0])} // Use pimples[0] as the y-coordinate
                  r={4}
                  stroke="red"
                  fill="black"
                />
              );
            }}
          </LineChart>

          {/* X-Axis */}
          <XAxis
            style={{ marginHorizontal: 0, marginTop: 0, height: 40 }} // Add height for extra space
            data={dates.map((_, index) => index)}
            formatLabel={(index) => {
              if (index === 0) return dates[0].slice(5, 10); // Show the first date
              if (index === Math.floor(dates.length / 2)) return dates[Math.floor(dates.length / 2)].slice(5, 10); // Show the middle date
              if (index === dates.length - 1) return dates[dates.length - 1].slice(5, 10); // Show the last date
              return ''; // Hide intermediate labels
            }}
            svg={{
              fontSize: 10,
              fontweight: 'bold',
              fill: 'black',
              rotation: 0, // Rotate for better visibility
              originY: 25, // Adjust vertical origin
              textAnchor: 'middle', // Align text properly
            }}
            contentInset={{ left: 15, right: 15 }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    backgroundColor: 'transparent',
  },
  chartContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  yAxis: {
    marginTop: 20,
    height: 170,
  },
  lineChartContainer: {
    flex: 1,
    marginLeft: 5,
    marginTop: 20,
  },
  lineChart: {
    height: 170,
    width: '100%',
  },
  xAxis: {
    marginTop: 0,
    paddingLeft: 0
  },
});

export default PimpleChart;
