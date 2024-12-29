import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import MonthPicker from './MonthPicker';

const MonthlyEmotions = ({ onClose }) => {
    const [emotionData, setEmotionData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentDate, setCurrentDate] = useState(() => {
        // Force current month
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        console.log('Setting initial date to:', firstDayOfMonth.toLocaleDateString());
        return firstDayOfMonth;
    });
    

    // Enhanced color palette with sunset/sunrise theme
    const EMOTION_COLORS = {
        joy: '#FFB07B',           // Warm orange
        contentment: '#7CB9E8',   // Calm blue
        sadness: '#6F8FAF',       // Steel blue
        anxiety: '#9683EC',       // Soft purple
        anger: '#FF6B6B',         // Coral red
        surprise: '#FFB861',      // Amber
        love: '#FF85A2',          // Rose pink
        neutral: '#8E99A4',       // Cool gray
        fear: '#9B6B9E',          // Muted purple
        excitement: '#FF7E5F',    // Vibrant coral
        gratitude: '#90CFA0',     // Sage green
        hope: '#87CEEB',          // Sky blue
        frustration: '#E57373',   // Soft red
        disappointment: '#CFA07B', // Dusty brown
        pride: '#B695C0'          // Lavender
    };

    const getEmotionColor = (emotion) => {
        return EMOTION_COLORS[emotion.toLowerCase()] || '#8E99A4';
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Format date as YYYY-MM-DD
                const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
                console.log('Fetching data for date:', dateStr);

                const response = await axios.get('/journal_entries/monthly_emotions', {
                    params: { date: dateStr }
                });

                console.log('Response data:', response.data);
                
                if (response.data.emotion_counts && Object.keys(response.data.emotion_counts).length > 0) {
                    const transformedData = Object.entries(response.data.emotion_counts)
                        .map(([emotion, count]) => ({
                            name: emotion.charAt(0).toUpperCase() + emotion.slice(1),
                            value: count,
                            percentage: ((count / response.data.total_entries) * 100).toFixed(1)
                        }))
                        .sort((a, b) => b.value - a.value);

                    console.log('Transformed data:', transformedData);
                    setEmotionData(transformedData);
                } else {
                    console.log('No emotion data found');
                    setEmotionData([]);
                }
            } catch (err) {
                console.error('Error details:', err.response || err);
                setError('Failed to load emotion data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentDate]);

    const changeMonth = (direction) => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
            console.log('Changing to month:', newDate.toLocaleDateString());
            return newDate;
        });
    };

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return percent > 0.05 ? (
            <text 
                x={x} 
                y={y} 
                fill="white" 
                textAnchor="middle" 
                dominantBaseline="central"
                className="text-sm font-medium"
            >
                {name}
            </text>
        ) : null;
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
            <div className="relative w-full max-w-4xl bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 -right-10 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />

                {/* Content container */}
                <div className="relative p-6 sm:p-8">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white 
                                 bg-white/5 hover:bg-white/10 rounded-lg transition-colors duration-200"
                    >
                        <X size={20} />
                    </button>

                    {/* Header section */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text">
                            Monthly Emotional Journey
                        </h2>
                        <p className="text-gray-400 mt-1">Deep dive into your monthly emotional patterns</p>
                    </div>

                    {/* Month navigation */}
                    <div className="flex justify-center mb-8">
                        <MonthPicker 
                            currentDate={currentDate}
                            onMonthSelect={(newDate) => setCurrentDate(newDate)}
                        />
                    </div>

                    {/* Chart content */}
                    <div className="relative">
                        {loading ? (
                            <div className="h-[400px] flex items-center justify-center">
                                <div className="w-8 h-8 border-4 border-orange-500/30 border-t-orange-500 
                                              rounded-full animate-spin" />
                            </div>
                        ) : error ? (
                            <div className="h-[400px] flex items-center justify-center text-red-400">
                                {error}
                            </div>
                        ) : emotionData.length === 0 ? (
                            <div className="h-[400px] flex items-center justify-center text-gray-400">
                                No journal entries for this month
                            </div>
                        ) : (
                            <div className="h-[400px]">
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie
                                            data={emotionData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={renderCustomizedLabel}
                                            outerRadius={150}
                                            innerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {emotionData.map((entry, index) => (
                                                <Cell 
                                                    key={`cell-${index}`}
                                                    fill={getEmotionColor(entry.name)}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    return (
                                                        <div className="bg-gray-800/90 backdrop-blur-sm border 
                                                                    border-white/10 rounded-lg p-3 shadow-xl">
                                                            <p className="text-white font-medium">
                                                                {payload[0].name}
                                                            </p>
                                                            <p className="text-gray-300">
                                                                {payload[0].payload.percentage}%
                                                            </p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        {/* Legend */}
                        {!loading && !error && emotionData.length > 0 && (
                            <div className="mt-8 flex flex-wrap justify-center gap-4">
                                {emotionData.map((entry, index) => (
                                    <div key={`legend-${index}`} 
                                         className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
                                        <div 
                                            className="w-3 h-3 rounded"
                                            style={{ backgroundColor: getEmotionColor(entry.name) }}
                                        />
                                        <span className="text-sm text-gray-200">
                                            {entry.name} ({entry.percentage}%)
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonthlyEmotions;