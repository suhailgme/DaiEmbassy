
import React from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import { curveMonotoneX, curveBasis } from "d3-shape"

import { ChartCanvas, Chart, ZoomButtons } from "react-stockcharts";
import {
	AreaSeries,
	LineSeries
} from "react-stockcharts/lib/series";
import { Label } from "react-stockcharts/lib/annotation";
import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
	CrossHairCursor,
	MouseCoordinateX,
	MouseCoordinateY,
} from "react-stockcharts/lib/coordinates";

import { SingleValueTooltip } from "react-stockcharts/lib/tooltip";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last } from "react-stockcharts/lib/utils";
import EdgeIndicator from "react-stockcharts/lib/coordinates/EdgeIndicator";
import { HoverTooltip } from "react-stockcharts/lib/tooltip";

const dateFormat = timeFormat("%Y-%m-%d");
const numberFormat = format('.4s')


class AreaChartWithEdge extends React.Component {
	state = {suffix: 1}


	handleReset = () => {
		this.setState({suffix: this.state.suffix + 1})
	}
	

	render() {
		const { type, data: initialData, width, ratio, cdpId } = this.props;

		const xScaleProvider = discontinuousTimeScaleProvider
			.inputDateAccessor(d => d.date);
		const {
			data,
			xScale,
			xAccessor,
			displayXAccessor,
		} = xScaleProvider(initialData);

		const start = xAccessor(last(data));
		const end = xAccessor(data[Math.max(0, data.length-400)]);
		const xExtents = [start, end];
		return (
			<ChartCanvas height={490}
                // clamp={true}
				ratio={ratio}
				width={width}
				margin={{ left: 10, right: 10, top: 20, bottom: 30 }}
				type={type}
				seriesName={`CDP_COLLATERAL_${this.state.suffix}`}
				data={data}
				xScale={xScale}
				xAccessor={xAccessor}
				displayXAccessor={displayXAccessor}
				xExtents={xExtents}

			>
			<Label 
				x={width  / 2} y={100}
				fontSize={30} 
				text= {`CDP ${cdpId} PETH Collateral`}
				fill='#BDC4C7'
				opacity={0.15} 
				fontFamily='roboto'
				/>
				<Label 
				x={width  / 2} y={140}
				fontSize={30} 
				text="Dai Embassy"
				fill='#BDC4C7'
				opacity={0.15} 
				fontFamily='roboto'
				fontSize={20}
				/>
				

			<Chart id={1} yExtents={d => [0, +d.pethCollateral + +d.pethCollateral*0.05]}>
				<XAxis axisAt="bottom" orient="bottom"  stroke="#BDC4C7" tickStroke="#BDC4C7"/>
				<YAxis axisAt="right" orient="left" ticks={5} tickStroke="#BDC4C7"/>

				<MouseCoordinateX
					at="bottom"
					orient="bottom"
					displayFormat={timeFormat("%Y-%m-%d")} />
				<MouseCoordinateY
					at="right"
					orient="left"
					displayFormat={format(".4s")} />
					

				<AreaSeries yAccessor={d => d.pethCollateral} fill='#189F3A' stroke='#189F3A' interpolation={curveMonotoneX}/>
                
				<SingleValueTooltip
					yLabel="PETH Collateral"
					yAccessor={d => d.pethCollateral}
					yDisplayFormat={format(".4s")}
					xLabel="Liquidation Price"
					xAccessor={d => d.liquidationPrice}
					xDisplayFormat={format(".2f")}
					origin={[10, 0]}
					valueFill= "#FFFFFF"
					/>	
					
					<SingleValueTooltip
					yLabel="Date" /* xLabel is optional, absence will not show the x value */ 
					yAccessor={d => d.date}
					yDisplayFormat={timeFormat("%Y-%m-%d")} 
					origin={[10, 20]}
					valueFill= "#FFFFFF"
					/>	


				<ZoomButtons onReset={this.handleReset}/>

				<EdgeIndicator displayFormat={format(".4s")} itemType='last' orient='left' edgeAt='right' fill="#6BA583" yAccessor={d=> d.pethCollateral}/>
			</Chart>
			<Chart id={2} yExtents={d => d.liquidationPrice}>
				<LineSeries
					yAccessor={d=> d.liquidationPrice}
					stroke='#eca94b'
					interpolation={curveBasis}
					/>
				<MouseCoordinateY
					at="left"
					orient="right"
					displayFormat={format("$.2f")} />
			<YAxis axisAt="left" orient="right" ticks={5} tickStroke="#BDC4C7" tickFormat={format(".2s")}/>	
			</Chart>
			<CrossHairCursor />
			</ChartCanvas>
		);
	}
}

AreaChartWithEdge.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

AreaChartWithEdge.defaultProps = {
	type: "svg",
};
AreaChartWithEdge = fitWidth(AreaChartWithEdge);

export default AreaChartWithEdge;
