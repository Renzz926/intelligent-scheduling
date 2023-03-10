import React, { useState, useLayoutEffect, useRef } from "react";
// import { useMount } from "ahooks";
import Card from "@/components/Card";
import { getDprSize } from "@/utils/utils";
import { formatTimeToDate } from "@/utils/format";
import BarsChart from "@/components/Charts/BarsChart/index.jsx";
import { Tab } from "@/components/Tab/Tab.jsx";
import IconPitching from "@/assets/icon_pitching.png";
import IconRotation from "@/assets/icon_rotation.png";
import IconCar from "@/assets/icon_car.png";
import CountUp from "react-countup";
import ScrollTable from "@/components/ScrollTable/ScrollTable.jsx";
import styles from "./index.less";

export default function HomePage() {
  const [curAc, setCurAc] = useState(0);
  const [barData, setBarData] = useState([]);
  const [deviceData1, setdeviceData1] = useState({});
  const [difval1, setdifval1] = useState([]);
  const [deviceData2, setdeviceData2] = useState({});
  const [difval2, setdifval2] = useState([]);
  const [deviceData3, setdeviceData3] = useState({});
  const [difval3, setdifval3] = useState([]);
  const [listData, setListData] = useState([]);
  const ws = useRef(null);
  const DeviceType = ["卸船机", "堆取料机", "皮带机"];

  useLayoutEffect(() => {
    setBarData([
      { name: "#5-1", value: 510, color: "#59DDFA" },
      { name: "#5-2", value: 1500, color: "#B77153" },
      { name: "#5-3", value: 710, color: "#B17BC5" },
      { name: "#5-4", value: 300, color: "#FCAD7C" },
      { name: "#5-5", value: 550, color: "#FD6643" },
      { name: "#5-6", value: 1000, color: "#FD6643" },
      { name: "#5-7", value: 1100, color: "#A3AD00" },
      { name: "#5-8", value: 660, color: "#A3AD00" },
    ]);
    setListData([
      {
        a1: "1",
        a2: "混合粉",
        a3: "10.1",
        a4: "16.3",
        a5: "103",
        a6: "2023/3/8",
      },
      {
        a1: "2",
        a2: "混合粉",
        a3: "12.1",
        a4: "19.3",
        a5: "63",
        a6: "2023/3/8",
      },
      {
        a1: "3",
        a2: "混合粉",
        a3: "14.9",
        a4: "16.3",
        a5: "109",
        a6: "2023/3/8",
      },
      {
        a1: "4",
        a2: "混合粉",
        a3: "16.8",
        a4: "17.3",
        a5: "145",
        a6: "2023/3/8",
      },
      {
        a1: "5",
        a2: "混合粉",
        a3: "18.5",
        a4: "26.3",
        a5: "187",
        a6: "2023/3/8",
      },
      {
        a1: "6",
        a2: "混合粉",
        a3: "20.3",
        a4: "19.3",
        a5: "101",
        a6: "2023/3/8",
      },
      {
        a1: "7",
        a2: "混合粉",
        a3: "22.4",
        a4: "18.3",
        a5: "433",
        a6: "2023/3/8",
      },
      {
        a1: "8",
        a2: "混合粉",
        a3: "26.5",
        a4: "23.3",
        a5: "93",
        a6: "2023/3/8",
      },
    ]);
  }, []);
  useLayoutEffect(() => {
    ws.current = new WebSocket("ws://101.43.218.96:9999");
    ws.current.onopen = () => {
      console.log("连接成功了");
      setInterval(() => {
        ws?.current?.send(
          JSON.stringify({
            CmdType: 1,
            User: "root",
            UserType: 1,
            deviceList: [
              {
                DeviceName: "Device0",
                DeviceType: 2,
                Type: 0,
                WriteNo: [{}],
              },
              {
                DeviceName: "Device1",
                DeviceType: 2,
                Type: 0,
                WriteNo: [{}],
              },
              {
                DeviceName: "Device2",
                DeviceType: 2,
                Type: 0,
                WriteNo: [{}],
              },
            ],
          })
        );
      }, 600);
    };
    ws.current.onmessage = ({ data }) => {
      const { nStatu, deviceList } = JSON.parse(data);
      if (nStatu === 0) {
        const device1 = deviceList[0];
        const device2 = deviceList[1];
        const device3 = deviceList[2];

        setdifval1([
          device1.Device0[0][40] - deviceData1.num1,
          device1.Device0[0][41] - deviceData1.num2,
          device1.Device0[0][42] - deviceData1.num3,
          device1.Device0[0][43] - deviceData1.num4,
        ]);
        setdifval2([
          device1.Device1[0][40] - deviceData2.num1,
          device1.Device1[0][41] - deviceData2.num2,
          device1.Device1[0][42] - deviceData2.num3,
          device1.Device1[0][43] - deviceData2.num4,
        ]);
        setdifval3([
          device2.Device2[0][40] - deviceData3.num1,
          device1.Device2[0][41] - deviceData3.num2,
          device1.Device2[0][42] - deviceData3.num3,
          device1.Device2[0][43] - deviceData3.num4,
        ]);

        setdeviceData1({
          num1: device1.Device0[0][40],
          num2: device1.Device0[0][41],
          num3: device1.Device0[0][42],
          num4: device1.Device0[0][43],
          type: 0,
          name: "#5",
          start: 10.2,
          end: 15.8,
        });
        setdeviceData2({
          num1: device2.Device1[0][40],
          num2: device2.Device1[0][41],
          num3: device2.Device1[0][42],
          num4: device2.Device1[0][43],
          type: 0,
          name: "#6",
          start: 14.2,
          end: 18.8,
        });
        setdeviceData3({
          num1: device3.Device2[0][40],
          num2: device3.Device2[0][41],
          num3: device3.Device2[0][42],
          num4: device3.Device2[0][43],
          type: 0,
          name: "#7",
          start: 16.2,
          end: 20.8,
        });
      }
    };
    return () => {
      ws.current?.close();
    };
  }, [ws]);

  const onChange = (v) => {
    setCurAc(v);
    if (v === 0) {
      setBarData([
        { name: "#5-1", value: 510, color: "#59DDFA" },
        { name: "#5-2", value: 1500, color: "#B77153" },
        { name: "#5-3", value: 710, color: "#B17BC5" },
        { name: "#5-4", value: 300, color: "#FCAD7C" },
        { name: "#5-5", value: 550, color: "#FD6643" },
        { name: "#5-6", value: 1000, color: "#FD6643" },
        { name: "#5-7", value: 1100, color: "#A3AD00" },
        { name: "#5-8", value: 660, color: "#A3AD00" },
      ]);
    } else if (v === 1) {
      setBarData([
        { name: "#6-1", value: 1500, color: "#59DDFA" },
        { name: "#6-2", value: 600, color: "#B77153" },
        { name: "#6-3", value: 700, color: "#B17BC5" },
        { name: "#6-4", value: 850, color: "#FCAD7C" },
        { name: "#6-5", value: 900, color: "#FD6643" },
        { name: "#6-6", value: 1600, color: "#FD6643" },
        { name: "#6-7", value: 1100, color: "#A3AD00" },
        { name: "#6-8", value: 360, color: "#A3AD00" },
      ]);
    } else {
      setBarData([
        { name: "#7-1", value: 550, color: "#59DDFA" },
        { name: "#7-2", value: 440, color: "#B77153" },
        { name: "#7-3", value: 700, color: "#B17BC5" },
        { name: "#7-4", value: 1830, color: "#FCAD7C" },
        { name: "#7-5", value: 900, color: "#FD6643" },
        { name: "#7-6", value: 1000, color: "#FD6643" },
        { name: "#7-7", value: 430, color: "#A3AD00" },
        { name: "#7-8", value: 880, color: "#A3AD00" },
      ]);
    }
    setListData([
      {
        a1: "1",
        a2: "混合粉",
        a3: "10.1",
        a4: "16.3",
        a5: "103",
        a6: "2023/3/7",
      },
      {
        a1: "2",
        a2: "混合粉",
        a3: "12.1",
        a4: "19.3",
        a5: "63",
        a6: "2023/3/7",
      },
      {
        a1: "3",
        a2: "混合粉",
        a3: "14.9",
        a4: "16.3",
        a5: "109",
        a6: "2023/3/7",
      },
      {
        a1: "4",
        a2: "混合粉",
        a3: "16.8",
        a4: "17.3",
        a5: "145",
        a6: "2023/3/7",
      },
      {
        a1: "5",
        a2: "混合粉",
        a3: "18.5",
        a4: "26.3",
        a5: "187",
        a6: "2023/3/7",
      },
      {
        a1: "6",
        a2: "混合粉",
        a3: "20.3",
        a4: "19.3",
        a5: "101",
        a6: "2023/3/7",
      },
      {
        a1: "7",
        a2: "混合粉",
        a3: "22.4",
        a4: "18.3",
        a5: "433",
        a6: "2023/3/7",
      },
      {
        a1: "8",
        a2: "混合粉",
        a3: "26.5",
        a4: "23.3",
        a5: "93",
        a6: "2023/3/7",
      },
    ]);
  };
  const cardContent = (data, difData) => {
    return (
      <div className={styles.cardContent}>
        <div className={styles.top}>
          <div className={styles.item}>
            <div className={styles.tit}>
              <img src={IconCar} alt="" /> 大车
            </div>
            <div className={styles.val}>
              <span>
                <CountUp
                  start={difData[0]}
                  end={data.num1 || 0}
                  decimals={1}
                  duration={0.4}
                />
              </span>
              米
            </div>
          </div>
          <div className={styles.line}></div>
          <div className={styles.item}>
            <div className={styles.tit}>
              <img src={IconRotation} alt="" /> 回转
            </div>
            <div className={styles.val}>
              <span>
                <CountUp
                  start={difData[1]}
                  end={data.num2 || 0}
                  decimals={1}
                  duration={0.4}
                />
              </span>
              度
            </div>
          </div>
          <div className={styles.line}></div>
          <div className={styles.item}>
            <div className={styles.tit}>
              <img src={IconPitching} alt="" /> 俯仰
            </div>
            <div className={styles.val}>
              <span>
                <CountUp
                  start={difData[2]}
                  end={data.num3 || 0}
                  decimals={1}
                  duration={0.4}
                />
              </span>
              度
            </div>
          </div>
        </div>
        <div className={styles.mid}>
          <div className={styles.item}>
            <div className={styles.tit}>| 类别</div>
            <div className={styles.val}>{DeviceType[data.type]}</div>
          </div>
          <div className={styles.item}>
            <div className={styles.tit}>| 料场</div>
            <div className={styles.val}>{data.name}</div>
          </div>
          <div className={styles.item}>
            <div className={styles.tit}>| 物料名称</div>
            <div className={styles.val}>混合粉</div>
          </div>
          <div className={styles.item}>
            <div className={styles.tit}>| 作业量</div>
            <div className={styles.val}>
              <CountUp
                start={difData[3]}
                end={data.num4 || 0}
                decimals={1}
                duration={0.4}
              />
            </div>
          </div>
        </div>
        <div className={styles.bott}>
          <div className={styles.item}>
            <div className={styles.label}> [开始位置] </div>
            <span>{data.start}</span>
          </div>
          <div className={styles.item}>
            <div className={styles.label}>[结束位置] </div>
            <span>{data.end}</span>
          </div>
        </div>
      </div>
    );
  };
  const columns = [
    {
      title: "料堆",
      dataIndex: "a1",
      key: "a1",
    },
    {
      title: "物料名称",
      dataIndex: "a2",
      key: "a2",
      width: 60,
    },
    {
      title: "开始点",
      dataIndex: "a3",
      key: "a3",
    },
    {
      title: "结束点",
      dataIndex: "a4",
      key: "a4",
    },
    {
      title: "体积",
      dataIndex: "a5",
      key: "a5",
    },
    {
      title: "进场时间",
      dataIndex: "a6",
      key: "a6",
      width: 70,
    },
  ];
  return (
    <div className={styles.home}>
      <div className={styles.header}></div>
      <div className={styles.bodyLeft}>
        <Card
          tagStatus="leisure"
          bodyStyle={{ height: "1.9083rem" }}
          title="SR5"
        >
          {cardContent(deviceData1, difval1)}
        </Card>
        <Card
          tagStatus="occupation"
          bodyStyle={{ height: "1.9083rem" }}
          title="SR6"
        >
          {cardContent(deviceData2, difval2)}
        </Card>
        <Card
          tagStatus="leisure"
          bodyStyle={{ height: "1.9083rem" }}
          title="SR7"
        >
          {cardContent(deviceData3, difval3)}
        </Card>
      </div>
      <div className={styles.bodyCenter}></div>
      <div className={styles.bodyRight}>
        <Card
          cardStyle={{ marginBottom: "0.1667rem" }}
          bodyStyle={{ height: "2.2917rem" }}
          title="功能菜单"
        ></Card>
        <Card bodyStyle={{ height: "4.4167rem" }} title="料场数据">
          <Tab
            value={curAc}
            onChange={onChange}
            options={[
              { label: "#5", value: 0 },
              { label: "#6", value: 1 },
              { label: "#7", value: 2 },
            ]}
          ></Tab>
          <div className={styles.list}>
            <div className={styles.title}>料场储量</div>
            <div style={{ height: "1.1rem" }}>
              <ScrollTable
                columns={columns}
                rowKey="a1"
                data={listData}
              ></ScrollTable>
            </div>
          </div>
          <div className={styles.line}></div>
          <div className={styles.title}>料场统计</div>
          <div
            style={{
              height: "1.9833rem",
              background: "rgba(0, 0, 0, 0.2)",
              borderRadius: "0.0167rem",
              boxSizing: "border-box",
              padding: "0.1333rem",
            }}
          >
            <BarsChart
              data={barData}
              yAxisProps={{
                axisLine: { show: false },
                name: "（m）",
                nameTextStyle: { color: "#fff" },
                splitLine: { show: true, color: "rgba(255,255,255,0.2)" },
                axisLabel: { color: "#fff" },
              }}
              xAxisProps={{
                axisLabel: { color: "#fff" },
                axisLine: {
                  lineStyle: {
                    color: "rgba(255,255,255,0.2)",
                  },
                },
              }}
              gridProps={{
                top: "15%",
              }}
              seriesMap={[
                {
                  type: "bar", // 图表配型（支持传入：line / bar）
                  code: "value", // 控制图表Y轴数据字段
                },
              ]}
              seriesProps={{
                barWidth: getDprSize(12),
                label: {
                  show: true,
                  position: "top",
                  color: "#fff",
                  fontSize: getDprSize(15),
                },
              }}
            ></BarsChart>
          </div>
        </Card>
      </div>
    </div>
  );
}
