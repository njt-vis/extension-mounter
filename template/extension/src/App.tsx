// import './App.css';

import { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import { Button } from 'antd';
// import dayjs from 'dayjs';

// console.log(dayjs());

// 准备数据
const data = [
  { genre: 'Sports', sold: 275 },
  { genre: 'Strategy', sold: 115 },
  { genre: 'Action', sold: 120 },
  { genre: 'Shooter', sold: 350 },
  { genre: 'Other', sold: 150 },
];

export default function App() {
  const container = useRef(null);

  useEffect(() => {
    console.log('render');

    if (!container?.current) return;
    // 初始化图表实例
    const chart = new Chart({
      container: container.current,
    });

    // 声明可视化
    chart
      .interval() // 创建一个 Interval 标记
      .data(data) // 绑定数据
      .encode('x', 'genre') // 编码 x 通道
      .encode('y', 'sold'); // 编码 y 通道

    // 渲染可视化
    chart.render();
  });

  return (
    <>
      <h1>Extension render by react</h1>
      <div ref={container}></div>
      <>
        <Button type="primary">Primary Button</Button>
        <Button>Default Button</Button>
        <Button type="dashed">Dashed Button</Button>
        <br />
        <Button type="text">Text Button</Button>
        <Button type="link">Link Button</Button>
      </>
    </>
  );
}
