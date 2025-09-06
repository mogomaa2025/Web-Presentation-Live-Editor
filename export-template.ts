export const getExportableHtml = (slidesData: any[]) => {
  const slidesJSON = JSON.stringify(slidesData, null, 2);

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>The Evolution of Social Media</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      @keyframes slide-in-right {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slide-in-left {
        from { transform: translateX(-100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      .animate-slide-in-right { animation: slide-in-right 0.5s ease-out; }
      .animate-slide-in-left { animation: slide-in-left 0.5s ease-out; }
    </style>
</head>
<body class="bg-gray-100">
    <div id="root"></div>
    <script type="importmap">
    {
      "imports": {
        "react": "https://aistudiocdn.com/react@^19.1.1",
        "react-dom/client": "https://aistudiocdn.com/react-dom@^19.1.1/client",
        "recharts": "https://aistudiocdn.com/recharts@^3.1.2"
      }
    }
    </script>
    <script type="module">
      import React, { useState, useCallback, useEffect } from 'react';
      import ReactDOM from 'react-dom/client';
      import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie, LineChart, Line } from 'recharts';

      const PRESENTATION_DATA = ${slidesJSON};

      // --- Chart Component Definitions ---
      const CustomTooltip = ({ active, payload, label, content }) => {
        if (active && payload && payload.length) {
          return (
            React.createElement('div', { className: "bg-white p-3 rounded-lg border border-slate-200 text-slate-700 shadow-lg" },
              React.createElement('p', { className: "font-bold" }, label),
              content(payload)
            )
          );
        }
        return null;
      };
      
      const PlatformGrowthChart = () => {
          const data = [{ name: 'MySpace', users: 75, color: '#6366F1' }, { name: 'Twitter', users: 330, color: '#38BDF8' }, { name: 'Instagram', users: 1200, color: '#EC4899' }, { name: 'YouTube', users: 2500, color: '#F87171' }, { name: 'Facebook', users: 2900, color: '#3B82F6' }];
          return React.createElement('div', { className: 'w-full h-full flex flex-col items-center justify-center text-slate-800 p-4' }, React.createElement('h3', { className: 'text-xl font-semibold mb-4 text-slate-800' }, 'Peak Active Users (in Millions)'), React.createElement(ResponsiveContainer, { width: '100%', height: '90%' }, React.createElement(BarChart, { data, margin: { top: 5, right: 20, left: 20, bottom: 5 } }, React.createElement(CartesianGrid, { strokeDasharray: '3 3', stroke: '#e5e7eb' }), React.createElement(XAxis, { dataKey: 'name', stroke: '#6b7280' }), React.createElement(YAxis, { stroke: '#6b7280' }), React.createElement(Tooltip, { content: props => React.createElement(CustomTooltip, { ...props, content: payload => React.createElement('p', { className: 'text-sm' }, \`Users: \${payload[0].value} million\`) }) }), React.createElement(Legend, { formatter: value => React.createElement('span', {className: 'text-slate-600'}, value) }), React.createElement(Bar, { dataKey: 'users', name: 'Users (Millions)' }, data.map((entry, index) => React.createElement(Cell, { key: \`cell-\${index}\`, fill: entry.color }))))));
      };

      const TimeSpentChart = () => {
          const data = [{ name: 'Facebook', time: 33, color: '#3B82F6' }, { name: 'YouTube', time: 45, color: '#F87171' }, { name: 'Instagram', time: 53, color: '#EC4899' }, { name: 'TikTok', time: 95, color: '#2DD4BF' }];
          return React.createElement('div', { className: 'w-full h-full flex flex-col items-center justify-center text-slate-800 p-4' }, React.createElement('h3', { className: 'text-xl font-semibold mb-4 text-slate-800' }, 'Average Daily Time Spent by Users'), React.createElement(ResponsiveContainer, { width: '100%', height: '90%' }, React.createElement(BarChart, { data, layout: 'vertical', margin: { top: 5, right: 30, left: 20, bottom: 5 } }, React.createElement(CartesianGrid, { strokeDasharray: '3 3', stroke: '#e5e7eb' }), React.createElement(XAxis, { type: 'number', stroke: '#6b7280' }), React.createElement(YAxis, { type: 'category', dataKey: 'name', stroke: '#6b7280', width: 80 }), React.createElement(Tooltip, { content: props => React.createElement(CustomTooltip, { ...props, content: payload => React.createElement('p', { className: 'text-sm' }, \`Time: \${payload[0].value} minutes/day\`) }) }), React.createElement(Bar, { dataKey: 'time', name: 'Minutes per Day', barSize: 30 }, data.map((entry, index) => React.createElement(Cell, { key: \`cell-\${index}\`, fill: entry.color }))))));
      };
      
      const MentalHealthChart = () => {
          const data = [{ name: 'Negative Impact', value: 45, color: '#F43F5E' }, { name: 'No Impact', value: 35, color: '#64748B' }, { name: 'Positive Impact', value: 20, color: '#22C55E' }];
          return React.createElement('div', { className: 'w-full h-full flex flex-col items-center justify-center text-slate-800 p-4' }, React.createElement('h3', { className: 'text-xl font-semibold mb-4 text-slate-800' }, 'Perceived Impact on Mental Health'), React.createElement(ResponsiveContainer, { width: '100%', height: '90%' }, React.createElement(PieChart, null, React.createElement(Pie, { data, cx: '50%', cy: '50%', labelLine: false, outerRadius: 120, fill: '#8884d8', dataKey: 'value', nameKey: 'name' }, data.map((entry, index) => React.createElement(Cell, { key: \`cell-\${index}\`, fill: entry.color }))), React.createElement(Tooltip, { content: props => React.createElement(CustomTooltip, { ...props, content: payload => React.createElement('p', { className: 'font-bold' }, \`\${payload[0].name}: \${payload[0].value}%\`) }) }), React.createElement(Legend, { formatter: (value, entry) => React.createElement('span', { className: 'text-slate-600' }, \`\${value} (\${entry.payload.value}%)\`) }))));
      };

      const GlobalUsageChart = () => {
          const data = [{ year: '2018', users: 3.20, color: '#6366F1' }, { year: '2020', users: 3.96, color: '#38BDF8' }, { year: '2022', users: 4.59, color: '#34D399' }, { year: '2024', users: 5.17, color: '#F87171' }];
          return React.createElement('div', { className: 'w-full h-full flex flex-col items-center justify-center text-slate-800 p-4' }, React.createElement('h3', { className: 'text-xl font-semibold mb-4 text-slate-800' }, 'Global Social Media Users'), React.createElement(ResponsiveContainer, { width: '100%', height: '90%' }, React.createElement(BarChart, { data, margin: { top: 5, right: 20, left: 30, bottom: 5 } }, React.createElement(CartesianGrid, { strokeDasharray: '3 3', stroke: '#e5e7eb' }), React.createElement(XAxis, { dataKey: 'year', stroke: '#6b7280' }), React.createElement(YAxis, { stroke: '#6b7280', label: { value: 'Users (in Billions)', angle: -90, position: 'insideLeft', fill: '#6b7280' } }), React.createElement(Tooltip, { content: props => React.createElement(CustomTooltip, { ...props, content: payload => React.createElement('p', { className: 'text-sm' }, \`Active Users: \${payload[0].value} Billion\`) }) }), React.createElement(Bar, { dataKey: 'users', name: 'Users (Billions)' }, data.map((entry, index) => React.createElement(Cell, { key: \`cell-\${index}\`, fill: entry.color }))))));
      };

      const CreatorEconomyChart = () => {
          const data = [{ year: '2021', size: 104 }, { year: '2023', size: 250 }, { year: '2025', size: 370 }, { year: '2027', size: 480 }];
          return React.createElement('div', { className: 'w-full h-full flex flex-col items-center justify-center text-slate-800 p-4' }, React.createElement('h3', { className: 'text-xl font-semibold mb-4 text-slate-800' }, 'Creator Economy Market Size (Projected)'), React.createElement(ResponsiveContainer, { width: '100%', height: '90%' }, React.createElement(LineChart, { data, margin: { top: 5, right: 30, left: 30, bottom: 5 } }, React.createElement(CartesianGrid, { strokeDasharray: '3 3', stroke: '#e5e7eb' }), React.createElement(XAxis, { dataKey: 'year', stroke: '#6b7280' }), React.createElement(YAxis, { stroke: '#6b7280', label: { value: 'USD (Billions)', angle: -90, position: 'insideLeft', fill: '#6b7280' } }), React.createElement(Tooltip, { content: props => React.createElement(CustomTooltip, { ...props, content: payload => React.createElement('p', { className: 'text-sm' }, \`Market Size: $\${payload[0].value} Billion\`) }) }), React.createElement(Legend, { formatter: value => React.createElement('span', {className: 'text-slate-600'}, value) }), React.createElement(Line, { type: 'monotone', dataKey: 'size', name: "Market Size ($B)", stroke: '#3B82F6', strokeWidth: 3, dot: { r: 5 }, activeDot: { r: 8 } }))));
      };

      const chartComponents = {
        PlatformGrowthChart,
        TimeSpentChart,
        MentalHealthChart,
        GlobalUsageChart,
        CreatorEconomyChart,
      };

      // --- Viewer Components ---
      const SlideViewer = ({ data, direction }) => {
        const { title, subtitle, points, image, chartName, layout = 'text-left', videoUrl, titleStyle, subtitleStyle, pointsStyle } = data;
        const [isAnimating, setIsAnimating] = useState(true);
        const ChartComponent = chartName ? chartComponents[chartName] : null;

        useEffect(() => {
          setIsAnimating(true);
          const timer = setTimeout(() => setIsAnimating(false), 50);
          return () => clearTimeout(timer);
        }, [data]);
        
        const getStyle = (style) => ({ color: style?.color, fontSize: style?.fontSize ? \`\${style.fontSize}px\` : undefined });

        const textContent = React.createElement('div', { className: \`w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-12 \${layout === 'text-only' ? 'lg:w-full text-center' : ''}\`},
            React.createElement('h1', { style: getStyle(titleStyle), className: 'text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight' }, title),
            subtitle && React.createElement('h2', { style: getStyle(subtitleStyle), className: 'mt-4 text-xl lg:text-2xl text-blue-600 font-medium' }, subtitle),
            React.createElement('ul', { className: 'mt-6 space-y-4' },
                points.map((point, index) => React.createElement('li', { key: index, className: 'flex items-start' },
                    React.createElement('svg', { className: 'w-6 h-6 text-blue-500 mr-3 mt-1 flex-shrink-0', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' },
                        React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' })
                    ),
                    React.createElement('span', { style: getStyle(pointsStyle), className: 'text-slate-700 text-lg' }, point)
                ))
            )
        );

        const visualContent = React.createElement('div', { className: 'relative w-full lg:w-1/2 p-8 lg:p-12 flex items-center justify-center' },
            ChartComponent ? React.createElement(ChartComponent) :
            videoUrl ? React.createElement('div', { className: 'aspect-video w-full' }, React.createElement('iframe', { className: 'w-full h-full rounded-lg shadow-lg', src: videoUrl, title: 'YouTube video player', allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture', allowFullScreen: true })) :
            React.createElement('img', { src: image, alt: title, className: 'w-full h-full object-cover object-center rounded-lg shadow-lg' })
        );
        
        const slideAnimationClass = isAnimating ? (direction > 0 ? 'animate-slide-in-right' : 'animate-slide-in-left') : 'opacity-100';

        return React.createElement('div', { className: \`absolute inset-0 flex flex-col lg:flex-row items-center justify-center h-full w-full bg-white transition-opacity duration-500 \${slideAnimationClass}\` },
            React.createElement('div', { className: \`relative w-full h-full flex flex-col lg:flex-row items-center justify-center \${layout === 'text-right' ? 'lg:flex-row-reverse' : ''}\` },
                layout === 'text-only' ?
                React.createElement('div', { className: 'w-full max-w-4xl flex flex-col justify-center p-8 lg:p-12 text-center' },
                    React.createElement('h1', { style: getStyle(titleStyle), className: 'text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight' }, title),
                    subtitle && React.createElement('h2', { style: getStyle(subtitleStyle), className: 'mt-6 text-2xl lg:text-3xl text-blue-600 font-medium' }, subtitle),
                    React.createElement('div', { className: 'mt-8 text-slate-700 text-xl max-w-3xl mx-auto space-y-4' },
                        points.map((point, index) => React.createElement('p', { key: index, style: getStyle(pointsStyle) }, point))
                    )
                ) :
                React.createElement(React.Fragment, null, textContent, visualContent)
            )
        );
      };

      const AppViewer = () => {
        const slides = PRESENTATION_DATA;
        const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
        const [direction, setDirection] = useState(1);

        const handleNext = useCallback(() => {
          setDirection(1);
          setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, [slides.length]);

        const handlePrev = useCallback(() => {
          setDirection(-1);
          setCurrentSlideIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
        }, [slides.length]);
        
        const currentSlide = slides[currentSlideIndex];
        
        const presenterColors = {
          1: 'bg-blue-100 border border-blue-200 text-blue-800',
          2: 'bg-green-100 border border-green-200 text-green-800',
          3: 'bg-indigo-100 border border-indigo-200 text-indigo-800',
        };
        const presenterColorClass = currentSlide.presenter ? presenterColors[currentSlide.presenter] : '';
        
        const ArrowLeftIcon = (props) => React.createElement('svg', { ...props, xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', strokeWidth: 1.5, stroke: 'currentColor' }, React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18' }));
        const ArrowRightIcon = (props) => React.createElement('svg', { ...props, xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', strokeWidth: 1.5, stroke: 'currentColor' }, React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3' }));

        return React.createElement('main', { className: "flex flex-col items-center justify-center min-h-screen bg-gray-100 text-slate-800 p-4 font-sans antialiased overflow-hidden" },
          React.createElement('div', { className: "w-full max-w-6xl mx-auto aspect-[16/9] bg-white rounded-2xl shadow-xl shadow-gray-200 flex flex-col relative overflow-hidden border border-gray-200" },
            React.createElement('header', { className: "absolute top-0 left-0 w-full p-6 z-20 flex justify-between items-center" },
              React.createElement('h1', { className: "text-2xl font-bold text-slate-900" }, "The Evolution of Social Media"),
            ),
            React.createElement('div', { className: "flex-grow" },
              React.createElement(SlideViewer, { key: currentSlideIndex, data: currentSlide, direction: direction })
            ),
            React.createElement('footer', { className: "absolute bottom-0 left-0 w-full p-6 flex justify-between items-center z-10" },
              React.createElement('div', { className: 'flex items-center gap-4' },
                React.createElement('span', { className: 'text-sm font-medium text-slate-500' }, \`Slide \${currentSlideIndex + 1} of \${slides.length}\`),
                currentSlide.presenter && React.createElement('span', { className: \`px-3 py-1 text-xs font-semibold rounded-full \${presenterColorClass}\` }, \`Presenter \${currentSlide.presenter}\`)
              ),
              React.createElement('div', { className: "flex items-center gap-4" },
                React.createElement('button', { onClick: handlePrev, className: "p-3 rounded-full bg-white border border-slate-300 text-slate-600 hover:bg-blue-500 hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500", "aria-label": "Previous Slide" },
                  React.createElement(ArrowLeftIcon, { className: "w-6 h-6" })
                ),
                React.createElement('button', { onClick: handleNext, className: "p-3 rounded-full bg-white border border-slate-300 text-slate-600 hover:bg-blue-500 hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500", "aria-label": "Next Slide" },
                  React.createElement(ArrowRightIcon, { className: "w-6 h-6" })
                ),
              )
            )
          )
        );
      };

      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(React.createElement(AppViewer));
    </script>
</body>
</html>`;
};