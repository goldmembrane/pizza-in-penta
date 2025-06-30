"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./components/ui/chart";
import { Bar, BarChart, Line, LineChart, XAxis, YAxis } from "recharts";
import { Pizza, TrendingUp, Clock, Calendar } from "lucide-react";
import { Button } from "./components/ui/button";
import "./App.css";

// 차트 설정
const chartConfig = {
  포인트: {
    label: "혼잡도 포인트",
    color: "#ea580c",
  },
};

// 모의 API 데이터 (실제 API 연결 시 교체)
const mockApiData = [
  { 날짜: "2024-01-15", 시간대: "09:00", 포인트: 45 },
  { 날짜: "2024-01-15", 시간대: "10:00", 포인트: 62 },
  { 날짜: "2024-01-15", 시간대: "11:00", 포인트: 78 },
  { 날짜: "2024-01-15", 시간대: "12:00", 포인트: 95 },
  { 날짜: "2024-01-15", 시간대: "13:00", 포인트: 88 },
  { 날짜: "2024-01-15", 시간대: "14:00", 포인트: 72 },
  { 날짜: "2024-01-15", 시간대: "15:00", 포인트: 56 },
  { 날짜: "2024-01-15", 시간대: "16:00", 포인트: 43 },
  { 날짜: "2024-01-15", 시간대: "17:00", 포인트: 67 },
  { 날짜: "2024-01-15", 시간대: "18:00", 포인트: 89 },
  { 날짜: "2024-01-15", 시간대: "19:00", 포인트: 92 },
  { 날짜: "2024-01-15", 시간대: "20:00", 포인트: 76 },
];

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
        // const response = await fetch('/api/congestion-data')
        // const apiData = await response.json()
        // setData(apiData)

        // 현재는 모의 데이터 사용
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 로딩 시뮬레이션
        setData(mockApiData);
      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 혼잡도 레벨 계산
  const getCongestionLevel = (point) => {
    if (point >= 80) return { level: "매우 혼잡", color: "very-busy" };
    if (point >= 60) return { level: "혼잡", color: "busy" };
    if (point >= 40) return { level: "보통", color: "normal" };
    return { level: "여유", color: "free" };
  };

  // 평균 포인트 계산
  const averagePoint =
    data.length > 0
      ? Math.round(
          data.reduce((sum, item) => sum + item.포인트, 0) / data.length
        )
      : 0;

  const currentCongestion = getCongestionLevel(averagePoint);

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

        {/* 현재 상태 카드 */}
        <div className="stats-grid">
          <Card>
            <CardHeader className="card-header-small">
              <CardTitle className="card-title-small">현재 혼잡도</CardTitle>
              <TrendingUp className="card-icon" />
            </CardHeader>
            <CardContent>
              <div className="stat-value">{averagePoint}점</div>
              <p className={`stat-label ${currentCongestion.color}`}>
                {currentCongestion.level}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="card-header-small">
              <CardTitle className="card-title-small">최고 혼잡 시간</CardTitle>
              <Clock className="card-icon" />
            </CardHeader>
            <CardContent>
              <div className="stat-value">
                {data.length > 0
                  ? data.reduce((max, item) =>
                      item.포인트 > max.포인트 ? item : max
                    ).시간대
                  : "--:--"}
              </div>
              <p className="stat-sublabel">
                {data.length > 0
                  ? `${Math.max(...data.map((d) => d.포인트))}점`
                  : "데이터 없음"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="card-header-small">
              <CardTitle className="card-title-small">
                데이터 업데이트
              </CardTitle>
              <Calendar className="card-icon" />
            </CardHeader>
            <CardContent>
              <div className="stat-value">실시간</div>
              <p className="stat-sublabel">
                {new Date().toLocaleString("ko-KR")}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 메인 차트 */}
        <Card className="chart-card">
          <CardHeader>
            <div className="chart-header">
              <div className="chart-title-section">
                <CardTitle className="chart-title">시간대별 혼잡도</CardTitle>
                <CardDescription>
                  펜타곤 주변 피자 매장의 시간대별 혼잡도 포인트
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
                  <XAxis dataKey="시간대" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Bar dataKey="포인트" fill="#ea580c" radius={[4, 4, 0, 0]} />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name) => (
                          <div className="tooltip-content">
                            <div className="tooltip-indicator" />
                            <span className="tooltip-value">{value}점</span>
                            <span className="tooltip-level">
                              ({getCongestionLevel(value).level})
                            </span>
                          </div>
                        )}
                        labelFormatter={(label) => `시간: ${label}`}
                      />
                    }
                  />
                </BarChart>
              ) : (
                <LineChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="시간대" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Line
                    type="monotone"
                    dataKey="포인트"
                    stroke="#ea580c"
                    strokeWidth={3}
                    dot={{ fill: "#ea580c", strokeWidth: 2, r: 4 }}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name) => (
                          <div className="tooltip-content">
                            <div className="tooltip-indicator" />
                            <span className="tooltip-value">{value}점</span>
                            <span className="tooltip-level">
                              ({getCongestionLevel(value).level})
                            </span>
                          </div>
                        )}
                        labelFormatter={(label) => `시간: ${label}`}
                      />
                    }
                  />
                </LineChart>
              )}
            </ChartContainer>
          </CardContent>
        </Card>

        {/* 혼잡도 범례 */}
        <Card>
          <CardHeader>
            <CardTitle>혼잡도 기준</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="legend-grid">
              <div className="legend-item">
                <div className="legend-dot free-dot" />
                <span className="legend-text">여유 (0-39점)</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot normal-dot" />
                <span className="legend-text">보통 (40-59점)</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot busy-dot" />
                <span className="legend-text">혼잡 (60-79점)</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot very-busy-dot" />
                <span className="legend-text">매우 혼잡 (80-100점)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default App;
