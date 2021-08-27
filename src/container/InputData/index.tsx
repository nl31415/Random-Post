import { Button, Col, Input, InputNumber, Row, Tooltip } from "antd";
import { FC, memo, useState } from "react";
import "./style.scss";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "moment/locale/vi";
moment.locale("vi");
moment.updateLocale("vi", {
  months: [
    "Tháng Một",
    "Tháng Hai",
    "Tháng Ba",
    "Tháng Bốn",
    "Tháng Năm",
    "Tháng Sáu",
    "Tháng Bảy",
    "Tháng Tám",
    "Tháng Chín",
    "Tháng Mười",
    "Tháng Mười Một",
    "Tháng Mười Hai",
  ],
});

const localizer = momentLocalizer(moment);

interface TableItem {
  name: string;
  count: number;
}

const colorbg = [
  "FF6666",
  "FF9933",
  "66CC00",
  "00CCCC",
  "0066CC",
  "00CCCC",
  "0066CC",
  "6600CC",
  "CC00CC",
  "606060",
];

const InputData: FC = () => {
  const [tableData, setTableData] = useState<TableItem[]>([
    {
      name: "HẠNH PHÚC TỰ THÂN ",
      count: 12,
    },
    {
      name: "MỐI QUAN HỆ",
      count: 9,
    },
    {
      name: "NGOẠI TÌNH",
      count: 18,
    },
    {
      name: "LIFESTYLE ",
      count: 9,
    },
    {
      name: "MỞ PHỄU",
      count: 12,
    },
  ]);
  const [events, setEvents] = useState<Array<any>>([]);
  const endOfPreviousMonth = moment(new Date())
    .subtract(1, "months")
    .endOf("month")
    .format("YYYY-MM-DD");

  const startOfNextMonth = moment(new Date())
    .add(1, "months")
    .startOf("month")
    .format("YYYY-MM-DD");

  const TableRenderItem = (item: TableItem, index: number) => {
    return (
      <div className="table-item-container" key={index}>
        <Input
          value={item.name}
          className="input-name"
          onChange={(e) => {
            let newData: TableItem[] = [...tableData];
            newData[index].name = e.target.value;
            setTableData(newData);
          }}
        ></Input>

        <InputNumber
          value={item.count}
          className="input-count"
          onChange={(e) => {
            let newData: TableItem[] = [...tableData];
            newData[index].count = e;
            setTableData(newData);
          }}
          min={0}
        ></InputNumber>

        <i
          className="fas fa-trash icon-delete"
          onClick={() => {
            let newData: TableItem[] = [...tableData];
            newData.splice(index, 1);
            setTableData(newData);
          }}
        ></i>
      </div>
    );
  };

  const addNewItem = () => {
    setTableData([...tableData, { name: "", count: 0 }]);
  };

  const shuffleArray = (array: Array<any>) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const caculate = () => {
    //copy table data
    let data: Array<{
      name: string;
      count: number;
      type: number;
    }> = [];
    tableData.forEach((e, i) => {
      data.push({
        name: e.name,
        count: e.count,
        type: i,
      });
    });

    // push all event to arr
    let allItems: Array<{
      name: string;
      type: number;
    }> = [];
    data.forEach((e) => {
      for (let i = 0; i < e.count; i++) {
        allItems.push({ name: e.name, type: e.type });
      }
    });

    let date = new Date();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let firstDay = 1;
    let lastDay = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();

    let eventPerDay: Array<
      Array<{
        name: string;
        type: number;
        firstDay: number;
      }>
    > = [];

    for (let i = 0; i < allItems.length; i++) {
      if (!eventPerDay[firstDay - 1]) {
        eventPerDay[firstDay - 1] = [
          {
            ...allItems[i],
            firstDay: firstDay,
          },
        ];
      } else {
        eventPerDay[firstDay - 1].push({
          ...allItems[i],
          firstDay: firstDay,
        });
      }
      firstDay++;
      if (firstDay > lastDay) firstDay = 1;
    }

    shuffleArray(eventPerDay);
    let listEvent: Array<{
      name: string;
      type: number;
      firstDay: number;
    }> = [];

    eventPerDay.forEach((e, i) => {
      e.forEach((o) => {
        o.firstDay = i + 1;
        listEvent.push(o);
      });
    });

    let convertEvent: Array<{
      name: string;
      start: Date;
      end: Date;
      type: number;
    }> = [];
    for (let i = 0; i < listEvent.length; i++) {
      convertEvent.push({
        name: listEvent[i].name,
        start: new Date(`${month}/${listEvent[i].firstDay}/${year}`),
        end: new Date(`${month}/${listEvent[i].firstDay}/${year}`),
        type: listEvent[i].type,
      });
      firstDay += 1;
      if (firstDay > lastDay) firstDay = 1;
    }

    setEvents(convertEvent);
  };

  const EventElement = (prop: any) => {
    return (
      <Tooltip title={prop.event.name}>
        <div
          className="custom-rbg-event-item"
          style={{ background: `#${colorbg[prop.event.type % 10]}` }}
        >
          {prop.event.name}
        </div>
      </Tooltip>
    );
  };

  return (
    <div className="input-data-container">
      <Row>
        <Col span={6}>
          <div className="col-title">Nhập dữ liệu</div>
          {tableData.map((e, i) => TableRenderItem(e, i))}
          <div className="list-button">
            <Button
              onClick={() => addNewItem()}
              className="add-button"
              type="primary"
              style={{ marginRight: "10px" }}
            >
              <i className="fas fa-plus"></i>
            </Button>

            <Button onClick={caculate} className="random-button" type="primary">
              Random
            </Button>
          </div>
        </Col>

        <Col span={18} style={{ paddingLeft: "10px" }}>
          <div className="col-title">Lịch</div>
          <Calendar
            selectable
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            views={[Views.MONTH]}
            style={{ height: 500 }}
            date={new Date()}
            popup
            popupOffset={30}
            components={{
              toolbar: () => null,
              event: EventElement,
            }}
            formats={{
              weekdayFormat: (date, culture, localizer: any) =>
                localizer.format(date, "dddd", culture),
              dateFormat: (date, culture, localizer: any) => {
                const isEndOfPreviousMonth =
                  moment(date).diff(endOfPreviousMonth, "days") <= 0;
                const isStartOfNextMonth =
                  moment(date).diff(startOfNextMonth, "days") >= 0;
                if (isEndOfPreviousMonth || isStartOfNextMonth)
                  return localizer.format(date, "D/M", culture);
                return localizer.format(date, "D", culture);
              },
            }}
          ></Calendar>
        </Col>
      </Row>
    </div>
  );
};
export default memo(InputData);
