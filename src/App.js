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
import { Pizza, Target, AlertTriangle, MapPin, FileText } from "lucide-react";
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

  const userLang = navigator.language || navigator.userLanguage;

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
      const maxPoint = data.filter((item) => item.point >= 10350).slice(-1);
      setMaxPoint(maxPoint[0]);
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
            <span className="data-source-text">{t("collect")}</span>
          </div>
        </div>

        <div className="info-grid">
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
                <p className="peak-description">{t("last_popularity")}</p>
              </div>
            </CardContent>
          </Card>

          {/* 데이터 분석 카드 */}
          <Card className="analysis-card">
            <CardHeader>
              <div className="analysis-header">
                <FileText className="analysis-icon" />
                <CardTitle className="analysis-title">
                  {t("insight_title")}
                </CardTitle>
              </div>
              <CardDescription className="analysis-subtitle">
                {`📊 ${maxPoint !== null ? maxPoint.date : ""} ${t(
                  "analysis_title"
                )}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="analysis-content">
                <div className="analysis-section">
                  <p className="analysis-text">{t("analysis_first")}</p>
                </div>

                <div className="analysis-section">
                  <p className="analysis-text">{t("analysis_second")}</p>
                </div>

                <div className="analysis-section">
                  <p className="analysis-text">{t("analysis_third")}</p>
                </div>

                <div className="analysis-section">
                  <p className="analysis-text">{t("analysis_fourth")}</p>
                </div>
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

        {/* 사이트 목적 카드 */}
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
              <p className="purpose-description">{t("purpose_description")}</p>
              <ul className="purpose-features">
                <li>{t("purpose_first")}</li>
                <li>{t("purpose_second")}</li>
                <li>{t("purpose_third")}</li>
                <li>{t("purpose_fourth")}</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <footer className="footer">
          <div className="footer-content">
            <div className="footer-left"></div>

            <div className="footer-center"></div>

            <div className="footer-right">
              <div className="footer-links">
                <h4 className="footer-links-title">{t("law_script")}</h4>
                <div className="footer-links-list">
                  {userLang.startsWith("ko") && (
                    <a href="/privacy/privacy.html" className="footer-link">
                      {t("privacy_policy")}
                    </a>
                  )}
                  {userLang.startsWith("de") && (
                    <a href="/privacy/privacyDE.html" className="footer-link">
                      {t("privacy_policy")}
                    </a>
                  )}
                  {userLang.startsWith("en") && (
                    <a href="/privacy/privacyEN.html" className="footer-link">
                      {t("privacy_policy")}
                    </a>
                  )}
                  {userLang.startsWith("es") && (
                    <a href="/privacy/privacyES.html" className="footer-link">
                      {t("privacy_policy")}
                    </a>
                  )}
                  {userLang.startsWith("fr") && (
                    <a href="/privacy/privacyFR.html" className="footer-link">
                      {t("privacy_policy")}
                    </a>
                  )}
                  {userLang.startsWith("it") && (
                    <a href="/privacy/privacyIT.html" className="footer-link">
                      {t("privacy_policy")}
                    </a>
                  )}
                  {userLang.startsWith("ja") && (
                    <a href="/privacy/privacyJA.html" className="footer-link">
                      {t("privacy_policy")}
                    </a>
                  )}
                  {userLang.startsWith("zh") && (
                    <a href="/privacy/privacyZH.html" className="footer-link">
                      {t("privacy_policy")}
                    </a>
                  )}
                  {userLang.startsWith("ko") && (
                    <a href="/terms/terms.html" className="footer-link">
                      {t("terms_of_service")}
                    </a>
                  )}
                  {userLang.startsWith("de") && (
                    <a href="/terms/termsDE.html" className="footer-link">
                      {t("terms_of_service")}
                    </a>
                  )}
                  {userLang.startsWith("en") && (
                    <a href="/terms/termsEN.html" className="footer-link">
                      {t("terms_of_service")}
                    </a>
                  )}
                  {userLang.startsWith("es") && (
                    <a href="/terms/termsES.html" className="footer-link">
                      {t("terms_of_service")}
                    </a>
                  )}
                  {userLang.startsWith("fr") && (
                    <a href="/terms/termsFR.html" className="footer-link">
                      {t("terms_of_service")}
                    </a>
                  )}
                  {userLang.startsWith("it") && (
                    <a href="/terms/termsIT.html" className="footer-link">
                      {t("terms_of_service")}
                    </a>
                  )}
                  {userLang.startsWith("ja") && (
                    <a href="/terms/termsJA.html" className="footer-link">
                      {t("terms_of_service")}
                    </a>
                  )}
                  {userLang.startsWith("zh") && (
                    <a href="/terms/termsZH.html" className="footer-link">
                      {t("terms_of_service")}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
