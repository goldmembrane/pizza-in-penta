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
import "./i18n";
import { useTranslation } from "react-i18next";

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState("bar");

  const { t } = useTranslation();
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

        const sortedApiData = apiData
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(-10);
        setData(sortedApiData);
      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <Pizza className="loading-icon" />
          <p className="loading-text">{t("loading")}</p>
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
            <h1 className="main-title">{t("title")}</h1>
          </div>
          <p className="header-subtitle">{t("subtitle")}</p>
        </div>

        {/* 메인 차트 */}
        <Card className="chart-card">
          <CardHeader>
            <div className="chart-header">
              <div className="chart-title-section">
                <CardTitle className="chart-title">
                  {t("dateChartTitle")}
                </CardTitle>
                <CardDescription>{t("dateChartDesc")}</CardDescription>
              </div>
              <div className="chart-buttons">
                <Button
                  variant={chartType === "bar" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChartType("bar")}
                >
                  {t("bar")}
                </Button>
                <Button
                  variant={chartType === "line" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChartType("line")}
                >
                  {t("line")}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer className="chart-container">
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
            <div className="chart-disclaimer">
              이 차트는 펜타곤 주변 매장의 혼잡도를 기반으로 포인트를 자체
              계산하여 표현했습니다
              <br />
              정확한 수치가 아니라는 점을 참고해주시기 바랍니다
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default App;
