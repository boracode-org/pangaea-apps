"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const React = require("react");
const react_native_1 = require("react-native");
class MarqueeLabel extends react_1.Component {
    constructor(props) {
        super(props);
        this.textAnimate = () => {
            react_native_1.Animated.timing(this.state.right, {
                toValue: -this.state.totalTextWidth,
                duration: 10000
            }).start(() => {
                this.setState({
                    textOpacity: new react_native_1.Animated.Value(this.state.totalTextWidth)
                }, () => {
                    react_native_1.Animated.timing(this.state.textOpacity, {
                        toValue: this.state.totalTextWidth,
                        duration: 10000
                    }).start(() => {
                        this.textAnimate();
                    });
                });
            });
        };
        this.state = {
            right: new react_native_1.Animated.Value(0)
        };
        var charSize = this.props.textSize / 2;
        var totalTextWidth = charSize * this.props.text.length;
        this.state = {
            right: totalTextWidth,
            totalTextWidth,
            charSize,
            textOpacity: new react_native_1.Animated.Value(totalTextWidth)
        };
        this.updateRight = this.updateRight.bind(this);
        this.textAnimate = this.textAnimate.bind(this);
    }
    updateRight() {
        var newRight = this.state.right - 1;
        if (this.state.right < -this.state.totalTextWidth * this.state.charSize) {
            newRight = this.state.totalTextWidth;
        }
        this.setState({ right: newRight }, () => {
            // console.log("new Right",{newRight,totalTextWidth:this.state.totalTextWidth*this.state.charSize});
        });
    }
    componentDidMount() {
        // this.state.right.setValue(1);
        // this.textAnimate();
        setInterval(this.updateRight, 30);
    }
    render() {
        return (<react_native_1.View style={{ backgroundColor: "black", height: "100%", width: 1280 }}>
        <react_native_1.View style={{
            height: "100%",
            width: this.state.totalTextWidth * 2,
            bottom: 0,
            marginLeft: this.state.right,
            flexDirection: "row"
        }}>
          <react_native_1.Text style={{
            position: "absolute",
            color: "yellow",
            fontSize: this.props.textSize,
            textAlign: "right",
            fontWeight: "500"
        }}>
            {this.props.text}
          </react_native_1.Text>
        </react_native_1.View>
      </react_native_1.View>);
    }
}
exports.MarqueeLabel = MarqueeLabel;
/*
// <Text style={{ color: "red", marginLeft: 100 }}>{this.state.right} - TTW: {this.state.totalTextWidth}</Text> -- Debug purposes
//uses animated ... less smooth though
  <Animated.Text
                style={[
                    { color: "yellow", fontSize: this.props.textSize, textAlign: 'right', fontWeight: '500' },
                    {
                        transform: [
                            { translateX: this.state.textOpacity },
                        ],
                    }
                ]
                }>
                {this.props.text}
            </Animated.Text>
 */
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFycXVlZUxhYmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWFycXVlZUxhYmVsLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlDQUFrQztBQUVsQywrQkFBK0I7QUFDL0IsK0NBU3NCO0FBRXRCLE1BQWEsWUFBYSxTQUFRLGlCQUFtQjtJQUNuRCxZQUFZLEtBQUs7UUFDZixLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUF3QmYsZ0JBQVcsR0FBRyxHQUFHLEVBQUU7WUFDakIsdUJBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUU7Z0JBQ2hDLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYztnQkFDbkMsUUFBUSxFQUFFLEtBQUs7YUFDaEIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUU7Z0JBQ1osSUFBSSxDQUFDLFFBQVEsQ0FDWDtvQkFDRSxXQUFXLEVBQUUsSUFBSSx1QkFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQztpQkFDM0QsRUFDRCxHQUFHLEVBQUU7b0JBQ0gsdUJBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUU7d0JBQ3RDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWM7d0JBQ2xDLFFBQVEsRUFBRSxLQUFLO3FCQUNoQixDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRTt3QkFDWixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7b0JBQ3JCLENBQUMsQ0FBQyxDQUFDO2dCQUNMLENBQUMsQ0FDRixDQUFDO1lBQ0osQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUM7UUFFRixVQUFLLEdBQUc7WUFDTixLQUFLLEVBQUUsSUFBSSx1QkFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FDN0IsQ0FBQztRQTlDQSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7UUFDdkMsSUFBSSxjQUFjLEdBQUcsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUN2RCxJQUFJLENBQUMsS0FBSyxHQUFHO1lBQ1gsS0FBSyxFQUFFLGNBQWM7WUFDckIsY0FBYztZQUNkLFFBQVE7WUFDUixXQUFXLEVBQUUsSUFBSSx1QkFBUSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUM7U0FDaEQsQ0FBQztRQUNGLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUVwQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUU7WUFDdkUsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDO1NBQ3RDO1FBQ0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsRUFBRSxHQUFHLEVBQUU7WUFDdEMsb0dBQW9HO1FBQ3RHLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQTJCRCxpQkFBaUI7UUFDZixnQ0FBZ0M7UUFDaEMsc0JBQXNCO1FBQ3RCLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFDRCxNQUFNO1FBQ0osT0FBTyxDQUNMLENBQUMsbUJBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLGVBQWUsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FDckU7UUFBQSxDQUFDLG1CQUFJLENBQ0gsS0FBSyxDQUFDLENBQUM7WUFDTCxNQUFNLEVBQUUsTUFBTTtZQUNkLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsR0FBRyxDQUFDO1lBQ3BDLE1BQU0sRUFBRSxDQUFDO1lBQ1QsVUFBVSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSztZQUM1QixhQUFhLEVBQUUsS0FBSztTQUNyQixDQUFDLENBRUY7VUFBQSxDQUFDLG1CQUFJLENBQ0gsS0FBSyxDQUFDLENBQUM7WUFDTCxRQUFRLEVBQUUsVUFBVTtZQUNwQixLQUFLLEVBQUUsUUFBUTtZQUNmLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVE7WUFDN0IsU0FBUyxFQUFFLE9BQU87WUFDbEIsVUFBVSxFQUFFLEtBQUs7U0FDbEIsQ0FBQyxDQUVGO1lBQUEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FDbEI7VUFBQSxFQUFFLG1CQUFJLENBQ1I7UUFBQSxFQUFFLG1CQUFJLENBQ1I7TUFBQSxFQUFFLG1CQUFJLENBQUMsQ0FDUixDQUFDO0lBQ0osQ0FBQztDQUNGO0FBbkZELG9DQW1GQztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7R0FlRyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCJyZWFjdFwiO1xuXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7XG4gIEFwcFJlZ2lzdHJ5LFxuICBBbmltYXRlZCxcbiAgSW1hZ2UsXG4gIFN0eWxlU2hlZXQsXG4gIERpbWVuc2lvbnMsXG4gIFRleHQsXG4gIERldmljZUV2ZW50RW1pdHRlcixcbiAgVmlld1xufSBmcm9tIFwicmVhY3QtbmF0aXZlXCI7XG5cbmV4cG9ydCBjbGFzcyBNYXJxdWVlTGFiZWwgZXh0ZW5kcyBDb21wb25lbnQ8YW55LCBhbnk+IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdmFyIGNoYXJTaXplID0gdGhpcy5wcm9wcy50ZXh0U2l6ZSAvIDI7XG4gICAgdmFyIHRvdGFsVGV4dFdpZHRoID0gY2hhclNpemUgKiB0aGlzLnByb3BzLnRleHQubGVuZ3RoO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICByaWdodDogdG90YWxUZXh0V2lkdGgsXG4gICAgICB0b3RhbFRleHRXaWR0aCxcbiAgICAgIGNoYXJTaXplLFxuICAgICAgdGV4dE9wYWNpdHk6IG5ldyBBbmltYXRlZC5WYWx1ZSh0b3RhbFRleHRXaWR0aClcbiAgICB9O1xuICAgIHRoaXMudXBkYXRlUmlnaHQgPSB0aGlzLnVwZGF0ZVJpZ2h0LmJpbmQodGhpcyk7XG4gICAgdGhpcy50ZXh0QW5pbWF0ZSA9IHRoaXMudGV4dEFuaW1hdGUuYmluZCh0aGlzKTtcbiAgfVxuXG4gIHVwZGF0ZVJpZ2h0KCkge1xuICAgIHZhciBuZXdSaWdodCA9IHRoaXMuc3RhdGUucmlnaHQgLSAxO1xuXG4gICAgaWYgKHRoaXMuc3RhdGUucmlnaHQgPCAtdGhpcy5zdGF0ZS50b3RhbFRleHRXaWR0aCAqIHRoaXMuc3RhdGUuY2hhclNpemUpIHtcbiAgICAgIG5ld1JpZ2h0ID0gdGhpcy5zdGF0ZS50b3RhbFRleHRXaWR0aDtcbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7IHJpZ2h0OiBuZXdSaWdodCB9LCAoKSA9PiB7XG4gICAgICAvLyBjb25zb2xlLmxvZyhcIm5ldyBSaWdodFwiLHtuZXdSaWdodCx0b3RhbFRleHRXaWR0aDp0aGlzLnN0YXRlLnRvdGFsVGV4dFdpZHRoKnRoaXMuc3RhdGUuY2hhclNpemV9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHRleHRBbmltYXRlID0gKCkgPT4ge1xuICAgIEFuaW1hdGVkLnRpbWluZyh0aGlzLnN0YXRlLnJpZ2h0LCB7XG4gICAgICB0b1ZhbHVlOiAtdGhpcy5zdGF0ZS50b3RhbFRleHRXaWR0aCxcbiAgICAgIGR1cmF0aW9uOiAxMDAwMFxuICAgIH0pLnN0YXJ0KCgpID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoXG4gICAgICAgIHtcbiAgICAgICAgICB0ZXh0T3BhY2l0eTogbmV3IEFuaW1hdGVkLlZhbHVlKHRoaXMuc3RhdGUudG90YWxUZXh0V2lkdGgpXG4gICAgICAgIH0sXG4gICAgICAgICgpID0+IHtcbiAgICAgICAgICBBbmltYXRlZC50aW1pbmcodGhpcy5zdGF0ZS50ZXh0T3BhY2l0eSwge1xuICAgICAgICAgICAgdG9WYWx1ZTogdGhpcy5zdGF0ZS50b3RhbFRleHRXaWR0aCxcbiAgICAgICAgICAgIGR1cmF0aW9uOiAxMDAwMFxuICAgICAgICAgIH0pLnN0YXJ0KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMudGV4dEFuaW1hdGUoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9KTtcbiAgfTtcblxuICBzdGF0ZSA9IHtcbiAgICByaWdodDogbmV3IEFuaW1hdGVkLlZhbHVlKDApXG4gIH07XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgLy8gdGhpcy5zdGF0ZS5yaWdodC5zZXRWYWx1ZSgxKTtcbiAgICAvLyB0aGlzLnRleHRBbmltYXRlKCk7XG4gICAgc2V0SW50ZXJ2YWwodGhpcy51cGRhdGVSaWdodCwgMzApO1xuICB9XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFZpZXcgc3R5bGU9e3sgYmFja2dyb3VuZENvbG9yOiBcImJsYWNrXCIsIGhlaWdodDogXCIxMDAlXCIsIHdpZHRoOiAxMjgwIH19PlxuICAgICAgICA8Vmlld1xuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBoZWlnaHQ6IFwiMTAwJVwiLFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUudG90YWxUZXh0V2lkdGggKiAyLFxuICAgICAgICAgICAgYm90dG9tOiAwLFxuICAgICAgICAgICAgbWFyZ2luTGVmdDogdGhpcy5zdGF0ZS5yaWdodCxcbiAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246IFwicm93XCJcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPFRleHRcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCIsXG4gICAgICAgICAgICAgIGNvbG9yOiBcInllbGxvd1wiLFxuICAgICAgICAgICAgICBmb250U2l6ZTogdGhpcy5wcm9wcy50ZXh0U2l6ZSxcbiAgICAgICAgICAgICAgdGV4dEFsaWduOiBcInJpZ2h0XCIsXG4gICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IFwiNTAwXCJcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3RoaXMucHJvcHMudGV4dH1cbiAgICAgICAgICA8L1RleHQ+XG4gICAgICAgIDwvVmlldz5cbiAgICAgIDwvVmlldz5cbiAgICApO1xuICB9XG59XG5cbi8qIFxuLy8gPFRleHQgc3R5bGU9e3sgY29sb3I6IFwicmVkXCIsIG1hcmdpbkxlZnQ6IDEwMCB9fT57dGhpcy5zdGF0ZS5yaWdodH0gLSBUVFc6IHt0aGlzLnN0YXRlLnRvdGFsVGV4dFdpZHRofTwvVGV4dD4gLS0gRGVidWcgcHVycG9zZXNcbi8vdXNlcyBhbmltYXRlZCAuLi4gbGVzcyBzbW9vdGggdGhvdWdoXG4gIDxBbmltYXRlZC5UZXh0XG4gICAgICAgICAgICAgICAgc3R5bGU9e1tcbiAgICAgICAgICAgICAgICAgICAgeyBjb2xvcjogXCJ5ZWxsb3dcIiwgZm9udFNpemU6IHRoaXMucHJvcHMudGV4dFNpemUsIHRleHRBbGlnbjogJ3JpZ2h0JywgZm9udFdlaWdodDogJzUwMCcgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0cmFuc2xhdGVYOiB0aGlzLnN0YXRlLnRleHRPcGFjaXR5IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH0+XG4gICAgICAgICAgICAgICAge3RoaXMucHJvcHMudGV4dH1cbiAgICAgICAgICAgIDwvQW5pbWF0ZWQuVGV4dD5cbiAqL1xuIl19