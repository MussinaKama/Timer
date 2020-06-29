import React from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Picker,
  Platform,
} from "react-native";

const screen = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#07121B",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    borderWidth: 10,
    borderColor: "#89AAFF",
    width: screen.width / 2,
    height: screen.width / 2,
    borderRadius: screen.width / 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  buttonStop: {
    borderColor: "#FF851B",
  },
  buttonText: {
    fontSize: 45,
    color: "#89AAFF",
  },
  buttonTextStop: {
    color: "#FF851B",
  },
  timerText: {
    fontSize: 90,
    color: "#fff",
  },
  picker: {
    width: 50,
    ...Platform.select({
      android: {
        color: "#fff",
        backgroundColor: "#07121B",
      },
    }),
  },
  itemPicker: {
    color: "#fff",
    fontSize: 20,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

const createArray = (length) => {
  const arr = [];
  let i = 0;
  while (i < length) {
    arr.push(i.toString());
    i += 1;
  }

  return arr;
};
const AVAILABLE_MINUTES = createArray(10);
const AVAILABLE_SECONDS = createArray(60);

const formatNumber = (number) => `0${number}`.slice(-2);

const getRemaining = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;
  return { minutes: formatNumber(minutes), seconds: formatNumber(seconds) };
};
export default class App extends React.Component {
  state = {
    remaininSeconds: 5,
    isRunning: false,
    selectedMinutes: "0",
    selectedSeconds: "0"
  };

  interval = null;

  componentDidUpdate(prevProp, prevState) {
    if (this.state.remaininSeconds === 0 && prevState.remaininSeconds !== 0) {
      this.stop();
    }
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  start = () => {
    this.setState((state) => ({
      remaininSeconds: parseInt(state.selectedMinutes, 10) * 60 + parseInt(state.selectedSeconds, 10),
      isRunning: true,
    }));

    this.interval = setInterval(() => {
      this.setState((state) => ({
        remaininSeconds: state.remaininSeconds - 1,
      }));
    }, 1000);
  };

  stop = () => {
    clearInterval(this.interval);
    this.interval = null;
    this.setState({ remaininSeconds: 5, isRunning: false });
  };

  renderPickers = () => (
    <View style={styles.pickerContainer}>
      <Picker
        style={styles.picker}
        itemStyle={styles.itemPicker}
        selectedValue={this.state.selectedMinutes}
        onValueChange={value => {this.setState({selectedMinutes: value})}}
        mode="dropdown"
      >
        {AVAILABLE_MINUTES.map((value) => {
          <Picker.Item key={value} label={value} value={value} />;
        })}
      </Picker>
      <Text style={styles.itemStyle}>minutes</Text>
      <Picker
        style={styles.picker}
        itemStyle={styles.itemPicker}
        selectedValue={this.state.selectedSeconds}
        onValueChange={value => {this.setState({selectedSeconds: value})}}
        mode="dropdown"
      >
        {AVAILABLE_SECONDS.map((value) => {
          <Picker.Item key={value} label={value} value={value} />;
        })}
      </Picker>
      <Text style={styles.itemStyle}>seconds</Text>
    </View>
  );

  render() {
    const { minutes, seconds } = getRemaining(this.state.remaininSeconds);
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        {this.state.isRunning ? (
          <Text style={styles.timerText}>{`${minutes}:${seconds}`}</Text>
        ) : (
          this.renderPickers()
        )}
        {this.state.isRunning ? (
          <TouchableOpacity
            onPress={this.stop}
            style={[styles.button, styles.buttonStop]}
          >
            <Text style={[styles.buttonText, styles.buttonTextStop]}>Stop</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={this.start} style={styles.button}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}
