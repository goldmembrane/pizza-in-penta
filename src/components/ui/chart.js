"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import "./chart.css";

const ChartContainer = React.forwardRef(
  ({ id, className, children, config, ...props }, ref) => {
    const uniqueId = React.useId();
    const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

    return (
      <div
        data-chart={chartId}
        ref={ref}
        className={`chart-container-wrapper ${className || ""}`}
        {...props}
      >
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    );
  }
);
ChartContainer.displayName = "Chart";

const ChartTooltip = RechartsPrimitive.Tooltip;

const ChartTooltipContent = React.forwardRef(
  ({ active, payload, label, labelFormatter, formatter, ...props }, ref) => {
    if (!active || !payload?.length) {
      return null;
    }

    return (
      <div ref={ref} className="chart-tooltip">
        {label && (
          <div className="chart-tooltip-label">
            {labelFormatter ? labelFormatter(label, payload) : label}
          </div>
        )}
        <div className="chart-tooltip-content">
          {payload.map((item, index) => (
            <div key={item.dataKey || index} className="chart-tooltip-item">
              {formatter && item?.value !== undefined ? (
                formatter(item.value, item.name, item, index, item.payload)
              ) : (
                <>
                  <div
                    className="chart-tooltip-indicator"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="chart-tooltip-details">
                    <span className="chart-tooltip-name">{item.name}</span>
                    {item.value && (
                      <span className="chart-tooltip-value">
                        {typeof item.value === "number"
                          ? item.value.toLocaleString()
                          : item.value}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
);
ChartTooltipContent.displayName = "ChartTooltipContent";

export { ChartContainer, ChartTooltip, ChartTooltipContent };
