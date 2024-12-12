import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { COLORS } from '../styles/shared-styles';

const EmotionsChart = ({ onClose }) => {
    const [emotionData, setEmotionData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentWeekStart, setCurrentWeekStart] = useState(() => {
        const now = new Date();
        return new Date(now.setDate(now.getDate() - now.getDay()));
    });

    
    // Use useMemo to memoize the color calculation for emotions
    const getEmotionColor = useMemo(() => {
        const EMOTION_COLORS = {
            joy: '#FFD700',
            contentment: COLORS.primary,
            sadness: '#4169E1',
            anxiety: '#9370DB',
            anger: COLORS.danger,
            surprise: COLORS.accent,
            love: '#FF69B4',
            neutral: '#808080'
        };
        const COLOR_PALETTE = [
            '#FF7F50', '#6A5ACD', '#7FFF00', '#FF4500', '#1E90FF',
            '#32CD32', '#FF6347', '#4682B4', '#00FA9A', '#FF1493',
            '#FFDAB9', '#98FB98', '#AFEEEE', '#DB7093', '#FFE4B5'
        ];


        return (emotionName) => {
            const lowercaseEmotion = emotionName.toLowerCase();
            return EMOTION_COLORS[lowercaseEmotion] || COLOR_PALETTE[emotionData.findIndex(item => 
                item.name.toLowerCase() === lowercaseEmotion
            ) % COLOR_PALETTE.length];
        };
    }, [emotionData]);

    const handleDateSelect = (event) => {
        const selectedDate = new Date(event.target.value);
        const weekRange = getWeekRange(selectedDate);
        setCurrentWeekStart(weekRange.start);
    };

    const formatDateRange = (startDate) => {
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);
        return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
    };

    const changeWeek = (direction) => {
        setCurrentWeekStart(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
            return newDate;
        });
    };

    const isCurrentWeek = (date) => {
        const now = new Date();
        const currentWeekStart = new Date(now.setDate(now.getDate() - now.getDay()));
        return date.toDateString() === currentWeekStart.toDateString();
    };

    const isFutureWeek = (date) => {
        const now = new Date();
        const currentWeekStart = new Date(now.setDate(now.getDate() - now.getDay()));
        return date > currentWeekStart;
    };

    const getWeekRange = (date) => {
        const start = new Date(date);
        start.setDate(start.getDate() - start.getDay());
        const end = new Date(start);
        end.setDate(end.getDate() + 6);
        return {
            start,
            end,
            displayText: `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
        };
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const endDate = new Date(currentWeekStart);
                endDate.setDate(endDate.getDate() + 6);
                
                const response = await axios.get('/journal_entries/weekly_emotions', {
                    params: {
                        start_date: currentWeekStart.toISOString().split('T')[0],
                        end_date: endDate.toISOString().split('T')[0]
                    }
                });

                const totalEntries = Object.values(response.data.emotion_counts).reduce((a, b) => a + b, 0);
                const transformedData = Object.entries(response.data.emotion_counts)
                    .map(([emotion, count]) => ({
                        name: emotion.charAt(0).toUpperCase() + emotion.slice(1),
                        value: count,
                        percentage: ((count / totalEntries) * 100).toFixed(1)
                    }))
                    .sort((a, b) => b.value - a.value);

                setEmotionData(transformedData);
            } catch (err) {
                setError('Failed to load emotion data');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentWeekStart]);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-gray-800 p-3 border border-gray-700 rounded-md">
                    <p className="text-white m-0 font-medium">{`${data.name}: ${data.percentage}%`}</p>
                    <p className="text-gray-300 m-0 text-sm">
                        ({data.value} {data.value === 1 ? 'entry' : 'entries'})
                    </p>
                </div>
            );
        }
        return null;
    };

    const renderCustomizedLegend = (props) => {
        return (
            <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                justifyContent: 'center',
                gap: '16px',
                marginTop: '20px'
            }}>
                {emotionData.map((entry, index) => (
                    <div key={`legend-${index}`} style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        marginRight: '8px'
                    }}>
                        <div style={{ 
                            width: '12px', 
                            height: '12px', 
                            backgroundColor: getEmotionColor(entry.name),
                            marginRight: '6px'
                        }}></div>
                        <span style={{ 
                            color: '#fff',
                            fontSize: '14px'
                        }}>
                            {entry.name} ({entry.percentage}%)
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
        }}>

            <div style={{
                backgroundColor: '#1a1a1a',
                padding: '24px',
                borderRadius: '12px',
                width: '95%',
                maxWidth: '700px',
                maxHeight: '90vh',
                overflow: 'auto',
                position: 'relative',
                border: '1px solid #333',
            }}>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                >
                    ×
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    {/* left and right arrows and text */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button
                            onClick={() => changeWeek('prev')}
                            style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                backgroundColor: 'transparent',
                                border: 'none',
                                color: '#ccc',
                                cursor: 'pointer',
                            }}
                        >
                            &lt;
                        </button>

                        <span style={{ fontSize: '14px', color: '#ccc' }}>
                            {formatDateRange(currentWeekStart)}
                            {isCurrentWeek(currentWeekStart) && (
                                <span style={{ marginLeft: '8px', color: '#ffa500' }}>(Current Week)</span>
                            )}
                        </span>

                        <button
                            onClick={() => changeWeek('next')}
                            disabled={isFutureWeek(new Date(currentWeekStart))}
                            style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                backgroundColor: 'transparent',
                                border: 'none',
                                color: '#ccc',
                                cursor: 'pointer',
                                opacity: isFutureWeek(new Date(currentWeekStart)) ? 0.5 : 1,
                            }}
                        >
                            &gt;
                        </button>
                    </div>

                    {/* Date Input Section */}
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <input
                            type="date"
                            onChange={handleDateSelect}
                            max={new Date().toISOString().split('T')[0]}
                            style={{
                                width: '150px',
                                padding: '8px 12px',
                                borderRadius: '4px',
                                border: '1px solid #555',
                                backgroundColor: '#333',
                                color: '#fff',
                                fontSize: '14px',
                            }}
                        />
                        
                    </div>
                </div>


                {loading ? (
                    <div className="flex justify-center items-center h-[300px]">
                        <p className="text-gray-400">Loading...</p>
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center h-[300px]">
                        <p className="text-red-400">{error}</p>
                    </div>
                ) : emotionData.length === 0 ? (
                    <div className="flex justify-center items-center h-[300px]">
                        <p className="text-gray-400">No journal entries for this week</p>
                    </div>
                ) : (
                    <div className="w-full flex flex-col items-center">
                        <PieChart width={400} height={300}>
                            <Pie
                                data={emotionData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
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
                            <Tooltip content={<CustomTooltip />} />
                            <Legend content={renderCustomizedLegend} verticalAlign="bottom" align="center" />
                        </PieChart>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmotionsChart;
