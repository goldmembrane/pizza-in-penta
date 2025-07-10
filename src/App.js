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
import { Pizza, Target, AlertTriangle, MapPin } from "lucide-react";
import { Button } from "./components/ui/button";
import "./App.css";
import "./i18n";
import { useTranslation } from "react-i18next";

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState("bar");
  const [maxPoint, setMaxPoint] = useState(null);

  const { t } = useTranslation();

  // API 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_BACKEND_API_URL + "/api/point-metrics"
        );
        const apiData = await response.json();

        const sortedApiData = apiData
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(-10);

        setData((prevData) => {
          const prevJson = JSON.stringify(prevData);
          const newJson = JSON.stringify(sortedApiData);
          if (prevJson !== newJson) {
            return sortedApiData;
          }
          return prevData; // 변화 없으면 업데이트 안 함
        });
      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // 10초마다 polling

    return () => clearInterval(interval);
  }, []);

  const peakCongestionData = () => {
    if (data.length > 0) {
      const maxPoint = data.reduce((max, item) =>
        item.point > max.point ? item : max
      );
      const lastMaxPoint = sessionStorage.getItem("maxpoint");

      if (lastMaxPoint !== null) {
        if (maxPoint.point > lastMaxPoint.point) {
          const newMaxPoint = JSON.stringify(maxPoint);
          sessionStorage.setItem("maxpoint", newMaxPoint);

          setMaxPoint(maxPoint);
        } else {
          setMaxPoint(lastMaxPoint);
        }
      } else {
        setMaxPoint(maxPoint);
        const newMaxPoint = JSON.stringify(maxPoint);
        sessionStorage.setItem("maxpoint", newMaxPoint);
      }
    }
  };

  useEffect(() => {
    if (data) {
      peakCongestionData();
    }
  }, [data]);

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

          <div className="data-source">
            <MapPin className="data-source-icon" />
            <span className="data-source-text">{t("google")}</span>
          </div>
        </div>

        <div className="info-grid">
          <Card className="purpose-card">
            <CardHeader>
              <div className="purpose-header">
                <Target className="purpose-icon" />
                <CardTitle className="purpose-title">
                  {t("purpose_title")}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="purpose-content">
                <h3 className="purpose-subtitle">{t("purpose_subtitle")}</h3>
                <p className="purpose-description">
                  {t("purpose_description")}
                </p>
                <ul className="purpose-features">
                  <li>{t("purpose_first")}</li>
                  <li>{t("purpose_second")}</li>
                  <li>{t("purpose_third")}</li>
                  <li>{t("purpose_fourth")}</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="peak-card">
            <CardHeader>
              <div className="peak-header">
                <AlertTriangle className="peak-icon" />
                <CardTitle className="peak-title">{t("peak_title")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="peak-content">
                <div className="peak-date">
                  {maxPoint ? maxPoint.date : t("nothing")}
                </div>
                <div className="peak-score">
                  {maxPoint ? `${maxPoint.point}${t("point")}` : t("zero")}
                </div>
                <p className="peak-description">{t("last_popularity")}</p>
              </div>
            </CardContent>
          </Card>
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
              {t("reference")}
              <br />
              {t("notAccuracy")}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default App;
