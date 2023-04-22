import React from "react";
import { Pie, PieChart, ResponsiveContainer, Sector } from "recharts";
import CenteredBox from "../util/CenteredBox";
import { Box, Tooltip, Typography } from "@mui/material";
import { formatCurrency, isSmallScreen } from "../util/util";

const SavingsGaugeVisual = ({
  gaugeVisualData,
  selectedMonthTotalExpenses,
}) => {
  const renderActiveSector = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      percent,
      name,
      value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 10) * cos;
    const my = cy + (outerRadius + 130) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;

    const tWidth = isSmallScreen() ? 150 : 300; // for everything to be visible, require the text to breakline if its small screen
    const tHeight = 150;
    const tx = ex + (cos >= 0 ? 1 : -1) * 12 - (cos >= 0 ? 0 : tWidth);
    const ty = ey - 37;
    const tAlign = cos >= 0 ? "left" : "right";

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle - 2}
          endAngle={endAngle + 2}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <foreignObject x={tx} y={ty} width={tWidth} height={tHeight}>
          <Box component="div" sx={{ textAlign: tAlign }}>
            <Typography variant="caption">
              <b>{name}</b>
              <br />
              {formatCurrency(value)}
              <br />
              {`(${(percent * 100).toFixed(2)}%)`}
            </Typography>
          </Box>
        </foreignObject>
      </g>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      {gaugeVisualData.length === 0 || selectedMonthTotalExpenses === 0 ? (
        <CenteredBox>
          {selectedMonthTotalExpenses === 0 ? (
            <Typography sx={{ fontStyle: "italic" }}>
              No expense data
            </Typography>
          ) : (
            <Tooltip
              title="Selected month or preceding selected month need to have at least one main income entry to show percentage of main income spent visual"
              enterTouchDelay={0}
            >
              <Typography sx={{ fontStyle: "italic" }}>
                Insufficient main income data
              </Typography>
            </Tooltip>
          )}
        </CenteredBox>
      ) : (
        <PieChart>
          <Pie
            dataKey="value"
            nameKey="name"
            data={gaugeVisualData}
            cx="50%"
            cy="90%"
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={70}
            activeIndex={gaugeVisualData.map((_, index) => index)} // all gauge data are displayed as active to show more data on each sector
            activeShape={renderActiveSector}
          />
        </PieChart>
      )}
    </ResponsiveContainer>
  );
};

export default SavingsGaugeVisual;
