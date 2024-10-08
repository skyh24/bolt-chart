import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Bitcoin } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function App() {
  const [bitcoinData, setBitcoinData] = useState<{ prices: [number, number][] }>({ prices: [] });

  useEffect(() => {
    const fetchBitcoinData = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30');
        setBitcoinData(response.data);
      } catch (error) {
        console.error('Error fetching Bitcoin data:', error);
      }
    };

    fetchBitcoinData();
    const interval = setInterval(fetchBitcoinData, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: bitcoinData.prices.map(price => new Date(price[0]).toLocaleDateString()),
    datasets: [
      {
        label: 'Bitcoin Price (USD)',
        data: bitcoinData.prices.map(price => price[1]),
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Bitcoin Price Chart (Last 30 Days)',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl">
        <div className="flex items-center justify-center mb-4">
          <Bitcoin className="text-yellow-500 mr-2" size={32} />
          <h1 className="text-3xl font-bold text-gray-800">Bitcoin Price Charts</h1>
        </div>
        <div className="mb-4">
          <Line data={chartData} options={chartOptions} />
        </div>
        <p className="text-center text-gray-600">
          Data updates every minute. Last updated: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}

export default App;