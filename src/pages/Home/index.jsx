import React, { useState, useEffect, useRef } from "react";
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
import { message } from "antd";

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
  const [bar5, setbar5] = useState([]);
  const [bar6, setbar6] = useState([]);
  const [bar7, setbar7] = useState([]);
  const [list5, setlist5] = useState([]);
  const [list6, setlist6] = useState([]);
  const [list7, setlist7] = useState([]);
  const DeviceType = ["卸船机", "堆取料机", "皮带机"];
  let baseArr = [
    { name: "-1", color: "#59DDFA" },
    { name: "-2", color: "#B77153" },
    { name: "-3", color: "#B17BC5" },
    { name: "-4", color: "#FCAD7C" },
    { name: "-5", color: "#FD6643" },
    { name: "-6", color: "#FD6643" },
    { name: "-7", color: "#A3AD00" },
    { name: "-8", color: "#A3AD00" },
  ];

  let timeoutObj = null;
  let serverTimeoutObj = null;
  let ws = null;

  const websocketclose = (e) => {
    // 监听连接
    console.log("断开连接", e);
    setTimeout(() => {
      init();
    }, 2000); // websocket关闭链接重连
  };
  const connectSocket = () => {
    // 连接websocket
    ws = new WebSocket("ws://101.43.218.96:9999");
    // 监听连接失败
    ws.onerror = websocketclose;
    // 监听连接关闭
    ws.onclose = websocketclose;
  };

  const longstart = () => {
    //1、通过关闭定时器和倒计时进行重置心跳
    timeoutObj && clearInterval(timeoutObj);
    serverTimeoutObj && clearTimeout(serverTimeoutObj);
    // 2、每隔1s向后端发送一条商议好的数据
    timeoutObj = setInterval(() => {
      console.log("重置监测心跳");
      if (ws.readyState === 1) {
        ws.send(
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
      }
      // 3、发送数据 2s后没有接收到返回的数据进行关闭websocket重连
      serverTimeoutObj = setTimeout(() => {
        console.log("后台挂掉，没有心跳了....");
        console.log("打印websocket的地址:" + ws);
        countDown();
        // ws.close();
      }, 2000);
    }, 1000);
  };

  message.config({
    top: 50,
    duration: 0,
    maxCount: 1,
  });
  const countDown = () => {
    const hide = message.loading("正在尝试重新连接..", 0, () => {});
    setTimeout(hide, 2000);
  };
  const init = () => {
    connectSocket(); // 建立websocket连接
    ws.onopen = () => {
      console.log("连接成功了");
      longstart();
    };
    ws.onmessage = ({ data }) => {
      longstart();
      const { nStatu, deviceList } = JSON.parse(data);
      if (nStatu === 0) {
        if (deviceList[0].Device0) {
          const device1 = deviceList[0].Device0[0];
          setbar5([
            device1[44],
            device1[45],
            device1[46],
            device1[47],
            device1[48],
            device1[49],
            device1[50],
            device1[51],
          ]);
          setlist5([
            device1[52],
            device1[53],
            device1[54],
            device1[55],
            device1[56],
            device1[57],
            device1[58],
            device1[59],
          ]);
          setdeviceData1({
            num1: device1[40],
            num2: device1[41],
            num3: device1[42],
            num4: device1[43],
            type: 0,
            name: "#5",
            start: 10.2,
            end: 15.8,
          });
          setdifval1([
            device1[40] - deviceData1.num1,
            device1[41] - deviceData1.num2,
            device1[42] - deviceData1.num3,
            device1[43] - deviceData1.num4,
          ]);
        }
        if (deviceList[1].Device1) {
          const device2 = deviceList[1].Device1[0];
          setbar6([
            device2[44],
            device2[45],
            device2[46],
            device2[47],
            device2[48],
            device2[49],
            device2[50],
            device2[51],
          ]);
          setlist6([
            device2[52],
            device2[53],
            device2[54],
            device2[55],
            device2[56],
            device2[57],
            device2[58],
            device2[59],
          ]);
          setdeviceData2({
            num1: device2[40],
            num2: device2[41],
            num3: device2[42],
            num4: device2[43],
            type: 0,
            name: "#6",
            start: 14.2,
            end: 18.8,
          });
          setdifval2([
            device2[40] - deviceData2.num1,
            device2[41] - deviceData2.num2,
            device2[42] - deviceData2.num3,
            device2[43] - deviceData2.num4,
          ]);
        }
        if (deviceList[2].Device2) {
          const device3 = deviceList[2].Device2[0];
          setbar7([
            device3[44],
            device3[45],
            device3[46],
            device3[47],
            device3[48],
            device3[49],
            device3[50],
            device3[51],
          ]);
          setlist7([
            device3[52],
            device3[53],
            device3[54],
            device3[55],
            device3[56],
            device3[57],
            device3[58],
            device3[59],
          ]);
          setdeviceData3({
            num1: device3[40],
            num2: device3[41],
            num3: device3[42],
            num4: device3[43],
            type: 0,
            name: "#7",
            start: 16.2,
            end: 20.8,
          });
          setdifval3([
            device3[40] - deviceData3.num1,
            device3[41] - deviceData3.num2,
            device3[42] - deviceData3.num3,
            device3[43] - deviceData3.num4,
          ]);
        }
      }
    };
  };
  useEffect(() => {
    init();
  }, [ws]);

  useEffect(() => {
    updateRightData();
  }, [curAc, bar5, bar6, bar7]);

  useEffect(() => {
    updataListData();
  }, [list5.length]);

  const updateRightData = () => {
    if (curAc === 0) {
      setBarData(
        bar5.map((item, i) => {
          return {
            name: `#5${baseArr[i].name}`,
            value: item,
            color: baseArr[i].color,
          };
        })
      );
    } else if (curAc === 1) {
      setBarData(
        bar6.map((item, i) => {
          return {
            name: `#6${baseArr[i].name}`,
            value: item,
            color: baseArr[i].color,
          };
        })
      );
    } else {
      setBarData(
        bar7.map((item, i) => {
          return {
            name: `#7${baseArr[i].name}`,
            value: item,
            color: baseArr[i].color,
          };
        })
      );
    }
  };

  const updataListData = () => {
    setListData([
      {
        a1: "1",
        a2: "混合粉",
        a3: "10.1",
        a4: "16.3",
        a5: curAc === 0 ? list5[0] : curAc === 1 ? list6[0] : list7[0],
        a6: formatTimeToDate(+new Date()),
      },
      {
        a1: "2",
        a2: "混合粉",
        a3: "12.1",
        a4: "19.3",
        a5: curAc === 0 ? list5[1] : curAc === 1 ? list6[1] : list7[1],
        a6: formatTimeToDate(+new Date()),
      },
      {
        a1: "3",
        a2: "混合粉",
        a3: "14.9",
        a4: "16.3",
        a5: curAc === 0 ? list5[2] : curAc === 1 ? list6[2] : list7[2],
        a6: formatTimeToDate(+new Date()),
      },
      {
        a1: "4",
        a2: "混合粉",
        a3: "16.8",
        a4: "17.3",
        a5: curAc === 0 ? list5[3] : curAc === 1 ? list6[3] : list7[3],
        a6: formatTimeToDate(+new Date()),
      },
      {
        a1: "5",
        a2: "混合粉",
        a3: "18.5",
        a4: "26.3",
        a5: curAc === 0 ? list5[4] : curAc === 1 ? list6[4] : list7[4],
        a6: formatTimeToDate(+new Date()),
      },
      {
        a1: "6",
        a2: "混合粉",
        a3: "20.3",
        a4: "19.3",
        a5: curAc === 0 ? list5[5] : curAc === 1 ? list6[5] : list7[5],
        a6: formatTimeToDate(+new Date()),
      },
      {
        a1: "7",
        a2: "混合粉",
        a3: "22.4",
        a4: "18.3",
        a5: curAc === 0 ? list5[6] : curAc === 1 ? list6[6] : list7[6],
        a6: formatTimeToDate(+new Date()),
      },
      {
        a1: "8",
        a2: "混合粉",
        a3: "26.5",
        a4: "23.3",
        a5: curAc === 0 ? list5[7] : curAc === 1 ? list6[7] : list7[7],
        a6: formatTimeToDate(+new Date()),
      },
    ]);
  };
  const onChange = (v) => {
    setCurAc(v);
    updataListData();
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
                  start={data.num1 - (difData[0] | 0)}
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
                  start={data.num2 - (difData[1] | 0)}
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
                  start={data.num3 - (difData[2] | 0)}
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
                start={data.num4 - (difData[3] | 0)}
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
      width: 40,
    },
    {
      title: "物料名称",
      dataIndex: "a2",
      key: "a2",
      width: 50,
    },
    {
      title: "开始点",
      dataIndex: "a3",
      key: "a3",
      width: 47,
    },
    {
      title: "结束点",
      dataIndex: "a4",
      key: "a4",
      width: 47,
    },
    {
      title: "体积",
      dataIndex: "a5",
      key: "a5",
      width: 40,
    },
    {
      title: "进场时间",
      dataIndex: "a6",
      key: "a6",
      width: 90,
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
                  formatter: (parms) => Math.floor(Number(parms.value)),
                },
              }}
            ></BarsChart>
          </div>
        </Card>
      </div>
    </div>
  );
}
