"use client";
import React from "react";
import SortableList, { SortableItem } from "react-easy-sort";
import arrayMove from "array-move";
import { Card, Col, Row, Table } from "antd";
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { MenuOutlined } from "@ant-design/icons";

export default function Home() {
  const [row, setRow] = React.useState(["One", "Two", "Three"]);

  const [items, setItems] = React.useState(["A", "B", "C"]);
  
  const rRow = ({ children, ...props }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      setActivatorNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: props["data-row-key"],
    });

    const style = {
      ...props.style,
      transform: CSS.Transform.toString(
        transform && {
          ...transform,
          scaleY: 1,
        }
      ),
      transition,
      ...(isDragging
        ? {
            position: "relative",
            zIndex: 1,
          }
        : {}),
    };

    return (
      <tr {...props} ref={setNodeRef} style={style} {...attributes}>
        {React.Children.map(children, (child) => {
          if (child.key === "sort") {
            return React.cloneElement(child, {
              children: (
                <MenuOutlined
                  ref={setActivatorNodeRef}
                  style={{
                    touchAction: "none",
                    cursor: "move",
                  }}
                  // onClick={handleMenuClick}
                  {...listeners}
                />
              ),
            });
          }
          return child;
        })}
      </tr>
    );
  };

  const columns = [
    {
      title: "#",
      key: "sort",
    },
    {
      title: "show",
      render: () => {
        return (
          <div
            style={{
              backgroundColor: "skyblue",
              padding: "5px",
              borderRadius: "10px",
              margin: "10px 10px",
              zIndex: 1,
            }}
          >
            ggggg
            {/* <SortableList
              onSortEnd={onSortEnd}
              className="list"
              draggedItemClassName="dragged"
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              {items.map((item) => (
                <SortableItem
                  key={item}
                  style={{
                    zIndex: 99,
                  }}
                >
                  <Card
                    title={`Card title ${item}`}
                    bordered={false}
                    style={{
                      width: 300,
                    }}
                  >
                    <p>Card content</p>
                    <p>Card content</p>
                    <p>Card content</p>
                  </Card>
                </SortableItem>
              ))}
            </SortableList> */}
          </div>
        );
      },
    },
  ];

  return (
    <DndContext
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={() => console.log("heeeee ")}
    >
      <SortableContext
        //rowKey array
        items={row.map((i) => i)}
        strategy={verticalListSortingStrategy}
      >
        <Table
          components={{
            body: {
              row: rRow,
            },
          }}
          columns={columns}
          dataSource={row}
        />
      </SortableContext>
    </DndContext>
  );
}
