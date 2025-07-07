"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { ChartContainer } from "./components/ui/chart";
import { Bar, BarChart, Line, LineChart, XAxis, YAxis } from "recharts";
import { Pizza } from "lucide-react";
import { Button } from "./components/ui/button";
import "./App.css";

// 차트 설정
const chartConfig = {
  포인트: {
    label: "혼잡도 포인트",
    color: "#ea580c",
  },
};

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState("bar");

  // API 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 실제 API 호출 예시:
        const response = await fetch(
          process.env.REACT_APP_BACKEND_API_URL + "/api/point-metrics"
        );
        const apiData = await response.json();

        const sortedApiData = apiData.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        setData(sortedApiData);

        // 현재는 모의 데이터 사용
        // setData(mockApiData);
      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log(data);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <Pizza className="loading-icon" />
          <p className="loading-text">혼잡도 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        {/* 헤더 */}
        <div className="header">
          <div className="header-title">
            <Pizza className="header-icon" />
            <h1 className="main-title">펜타곤 피자 혼잡도</h1>
          </div>
          <p className="header-subtitle">실시간 혼잡도 모니터링 대시보드</p>
        </div>

        {/* 메인 차트 */}
        <Card className="chart-card">
          <CardHeader>
            <div className="chart-header">
              <div className="chart-title-section">
                <CardTitle className="chart-title">날짜별 혼잡도</CardTitle>
                <CardDescription>
                  펜타곤 주변 피자 매장의 날짜별 혼잡도 포인트
                </CardDescription>
              </div>
              <div className="chart-buttons">
                <Button
                  variant={chartType === "bar" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChartType("bar")}
                >
                  막대 차트
                </Button>
                <Button
                  variant={chartType === "line" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChartType("line")}
                >
                  선 차트
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="chart-container">
              {chartType === "bar" ? (
                <BarChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="date" tickLine={false} axisLine={false} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 36000]}
                    ticks={[0]}
                  />
                  <Bar dataKey="point" fill="#ea580c" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <LineChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="date" tickLine={false} axisLine={false} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 36000]}
                    ticks={[0]}
                  />
                  <Line
                    type="monotone"
                    dataKey="point"
                    stroke="#ea580c"
                    strokeWidth={3}
                    dot={{ fill: "#ea580c", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              )}
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default App;
