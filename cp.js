"use client";
import { QUERY_DISPLAY_AD_LIST_CONST } from "@/lib/queryConst";
import SearchHandler from "@/lib/searchHandler";
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  MenuOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Drawer,
  Flex,
  Image,
  Modal,
  Popconfirm,
  Row,
  Space,
  Table,
  Tag,
} from "antd";
import React, { useState } from "react";
import AdListForm from "./adListform";
import AdListSequence from "./adListSequence";
import ADItemList from "./displayItemsBody";
import AdsItemsCard from "./adItemsCard";
import axios from "axios";
import { apiQueryHandler } from "@/lib/apiQueryHandler";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import Meta from "antd/es/card/Meta";
import SortableList, { SortableItem } from "react-easy-sort";

export default function ADListBody({ permissions, preData }) {
  const [adList, setAdList] = useState(preData?.value);
  const [paging, setPaging] = useState({
    pageNumber: 1,
    perPage: 10,
    total: preData?.count,
  });
  const [itemList, setItemList] = useState({
    count: 0,
    data: [],
    listId: "",
  });
  const [editAd, setEditAd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showItemDrawer, setShowItemDrawer] = useState(false);
  const [showAdListDrawer, setshowAdListDrawer] = useState(false);
  const [showSequenceDrawer, setShowSequenceDrawer] = useState(false);
  const [filter, setFilter] = useState(QUERY_DISPLAY_AD_LIST_CONST.filter);
  const [order, setOrder] = useState(QUERY_DISPLAY_AD_LIST_CONST.order);

  //column
  // const columns = [
  //   // {
  //   //   title: "Sequence",
  //   //   dataIndex: "sequence",
  //   //   align: "start",
  //   //   width: "1%",
  //   // },
  //   {
  //     title: "Image",
  //     align: "start",
  //     render: (record) => (
  //       <SortableList
  //         onSortEnd={() => console.log("sort end")}
  //         className="list"
  //         draggedItemClassName="dragged"
  //       >
  //         <Row gutter={16}>
  //           {record.AdsItems.map((i) => (
  //             <SortableItem key={i}>
  //               <Col>
  //                 <Badge.Ribbon
  //                   text={i.status ? "Active" : "InActive"}
  //                   color={i.status ? "green" : "red"}
  //                 >
  //                   <Card
  //                     title={i.name}
  //                     cover={
  //                       <img
  //                         alt="example"
  //                         style={{
  //                           padding: "0px",
  //                           height: "120px",
  //                           objectFit: "cover",
  //                         }}
  //                         src={i.imageUrl}
  //                       />
  //                     }
  //                   >
  //                     <Flex gap="4px 0" wrap="wrap">
  //                       <Tag color="green">View Count {i.viewCount}</Tag>
  //                       <Tag color="blue">Click Count {i.clickCount}</Tag>
  //                     </Flex>
  //                   </Card>
  //                 </Badge.Ribbon>
  //               </Col>
  //             </SortableItem>
  //           ))}
  //         </Row>
  //       </SortableList>
  //     ),
  //   },
  //   {
  //     title: "Actions",
  //     dataIndex: "actions",
  //     align: "right",
  //     width: "5%",
  //     render: (_, record) => {
  //       return (
  //         <Space>
  //           <Popconfirm
  //             title={record.status ? "De Activate AdList" : "Activate AdList"}
  //             description={`Are you sure ?`}
  //             okText="Delete"
  //             cancelText="Cancel"
  //             onConfirm={() => publishAdList(record.id, record.status)}
  //           >
  //             <Button
  //               style={{
  //                 background: record.status ? "#2bba3e" : "#cf3e43",
  //                 color: "white",
  //               }}
  //             >
  //               {record.status ? "isActived" : "inActive"}
  //             </Button>
  //           </Popconfirm>
  //           <Button
  //             type="primary"
  //             icon={<EditOutlined />}
  //             onClick={() => openAdListDrawer(record)}
  //             disabled={!permissions.includes("DISPLAY_ADS_LIST_EDIT")}
  //           />
  //           <Popconfirm
  //             title="Delete User"
  //             description={`Are you sure Delete AdList?`}
  //             okText="Delete"
  //             cancelText="Cancel"
  //             onConfirm={() => deleteAdsList(record.id)}
  //           >
  //             <Button
  //               type="primary"
  //               danger
  //               icon={<DeleteOutlined />}
  //               disabled={!permissions.includes("DISPLAY_ADS_LIST_DELETE")}
  //             />
  //           </Popconfirm>
  //         </Space>
  //       );
  //     },
  //   },
  // ];

  // drawer handler
  function openSequence(key) {
    setShowSequenceDrawer(key);
  }
  function closeSequence(reload) {
    if (reload) {
      getDataList(paging.pageNumber, paging.perPage);
    }
    setShowSequenceDrawer(false);
  }
  function openAdListDrawer(data) {
    if (data) {
      setEditAd(data);
    }
    setshowAdListDrawer(true);
  }
  function openItemList(selectedList) {
    setItemList(selectedList);
    setShowItemDrawer(true);
  }
  function closeAdList(reload) {
    if (reload) {
      getDataList(paging.pageNumber, paging.perPage);
    }
    setshowAdListDrawer(false);
    setEditAd(false);
  }
  function openAdItemDrawer(data) {
    if (data) {
      setEditAdItem(data);
    }
    setChildrenDrawer(true);
  }
  function closeAdItemDrawer() {
    setChildrenDrawer(false);
  }
  function closeItemList() {
    setShowItemDrawer(false);
    setItemList(false);
  }

  // get display data
  async function getDataList(pageNumber, perPage, updatedFilter = filter) {
    setLoading(true);
    axios
      .get(
        `/api/ad_list/get_ad_list?${await apiQueryHandler(
          QUERY_DISPLAY_AD_LIST_CONST,
          updatedFilter,
          order,
          QUERY_DISPLAY_AD_LIST_CONST.fields,
          "normal",
          { pageNumber, perPage }
        )}`
      )
      .then(({ data: result }) => {
        setPaging({
          pageNumber,
          perPage,
          total: result["@odata.count"],
        });
        setAdList(result.value);
      })
      .catch((error) => {
        error.message;
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function deleteAdsList(id) {
    axios
      .post("/api/ad_list/delete", { id })
      .then((res) => getDataList(paging.pageNumber, paging.perPage))
      .catch((err) => errorMessage(err));
  }

  function publishAdList(id, status) {
    axios
      .post("/api/ad_list/publish", { id: id, publish: status })
      .then((res) => {
        getDataList(paging.pageNumber, paging.perPage);
      })
      .catch((err) => errorMessage(err));
  }

  function expandRowHandler(record) {
    return (
      <>
        <Row justify="end">
          <Col>
            <Button
              type="primary"
              onClick={() =>
                openItemList({
                  count: record["@odata.count"],
                  data: record.AdsItems,
                  listId: record.id,
                })
              }
            >
              Manage Item
            </Button>
          </Col>
        </Row>

        <Descriptions bordered size="small" style={{ margin: "20px 0" }}>
          <Descriptions.Item label="Updated By">
            {record.updatedBy?.name || "---"}
          </Descriptions.Item>
          <Descriptions.Item label="Created By">
            {record.createdBy?.name || "---"}
          </Descriptions.Item>
          <Descriptions.Item label="Image Ratio">
            {record.imageRatio}
          </Descriptions.Item>
        </Descriptions>
        <AdsItemsCard data={record.AdsItems} type="normal" />
      </>
    );
  }

  // sequence update

  function updateSequnece(updateArr) {
    setLoading(true);
    axios
      .post(
        "/api/ad_list/sequence",
        updateArr.map((data) => {
          return {
            sequence: data.sequence,
            id: data.id,
          };
        })
      )
      .then((res) => {
        closeSequence(true);
      })
      .catch((err) => errorMessage(err));
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    })
  );

  //drag and sort

  const rRow = (props) => {
    const {
      attributes,
      listeners,
      setNodeRef,
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
      cursor: "move",
      ...(isDragging
        ? {
            position: "relative",
            zIndex: 9999,
          }
        : {}),
    };
    return (
      <tr
        {...props}
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      />
    );
  };

  const onDragEnd = ({ active, over }) => {
    if (over != null && active.id !== over?.id) {
      const activeIndex = adList.findIndex((i) => i.id === active.id);
      const overIndex = adList.findIndex((i) => i.id === over?.id);

      let endDragArr = arrayMove(adList, activeIndex, overIndex);
      let result = confirm(
        `Are you sure to move index ${adList[activeIndex].sequence} to ${adList[overIndex].sequence}`
      );
      if (!result) return;
      setAdList(endDragArr);

      if (activeIndex < overIndex) {
        for (let index = activeIndex; index <= overIndex; index++) {
          endDragArr[index] =
            index == overIndex
              ? {
                  ...endDragArr[index],
                  sequence: adList[index].sequence,
                }
              : {
                  ...endDragArr[index],
                  sequence: endDragArr[index].sequence - 1,
                };
        }
      } else if (activeIndex > overIndex) {
        for (let index = activeIndex; index >= overIndex; index--) {
          endDragArr[index] =
            index == overIndex
              ? {
                  ...endDragArr[index],
                  sequence: adList[overIndex].sequence,
                }
              : {
                  ...endDragArr[index],
                  sequence: endDragArr[index].sequence + 1,
                };
        }
      }

      updateSequnece(endDragArr);
    }
  };

  const onSortEnd = (oldIndex, newIndex, editObject) => {
    // console.log(oldIndex, newIndex, ea);
    setAdList(
      adList.map((ea) =>
        ea.id == editObject.id
          ? {
              ...ea,
              AdsItems: arrayMove(ea.AdsItems, oldIndex, newIndex),
            }
          : ea
      )
    );
  };

  console.log(adList);

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Row justify="space-between" align="center" gutter={24}>
          <Col span={24} flex="auto">
            <SearchHandler
              filter={filter}
              setFilter={setFilter}
              order={order}
              setOrder={setOrder}
              pagination={paging}
              apiHandler={getDataList}
            />
          </Col>
          <Col>
            <Button
              type="primary"
              onClick={() => openAdListDrawer("")}
              disabled={!permissions.includes("DISPLAY_ADS_LIST_CREATE")}
            >
              Create New
            </Button>
          </Col>
          <Col>
            <Button type="primary" onClick={() => openSequence(true)}>
              Sequnece Order
            </Button>
          </Col>
        </Row>
      </Col>
      <Col
        span={24}
        style={{
          height: "calc(100vh - 144px)",
          overflow: "hidden",
          overflowY: "auto",
        }}
      >
        {/* <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
          <SortableContext
            //rowKey array
            items={adList.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            <Table
              components={{
                body: {
                  row: rRow,
                },
              }}
              rowKey="id"
              dataSource={adList}
              columns={columns}
              loading={loading}
              expandable={{
                rowExpandable: (record) => true,
                expandedRowRender: (record) => expandRowHandler(record),
              }}
              pagination={{
                total: paging.total,
                defaultCurrent: 1,
                defaultPageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: [10, 20, 50],
                onChange: (pageNumber, perPage) => {
                  getDataList(pageNumber, perPage, filter);
                },
              }}
            />
          </SortableContext>
        </DndContext> */}
        <SortableList
          onSortEnd={(oldIndex, newIndex) => console.log("ggggggg")}
          className="list"
          draggedItemClassName="dragged"
        >
          {adList.map((ea) => (
            <SortableItem key={ea}>
              <Row
                style={{
                  border: "1px solid #e8e8e8",
                  padding: "5px",
                  backgroundColor: "red",
                  margin: "5px 0px",
                }}
              >
                <Divider orientation="left">Ad List {ea.sequence}</Divider>
                <SortableList
                  onSortEnd={(oldIndex, newIndex) =>
                    onSortEnd(oldIndex, newIndex, ea)
                  }
                  className="list"
                  draggedItemClassName="dragged"
                >
                  <Row gutter={16}>
                    {ea.AdsItems.map((i) => (
                      <SortableItem key={i.id}>
                        <Col>
                          <Badge.Ribbon
                            text={i.status ? "Active" : "InActive"}
                            color={i.status ? "green" : "red"}
                          >
                            <Card
                              title={i.name}
                              cover={
                                <img
                                  alt="example"
                                  style={{
                                    padding: "0px",
                                    height: "120px",
                                    objectFit: "cover",
                                  }}
                                  src={i.imageUrl}
                                />
                              }
                            >
                              <Flex gap="4px 0" wrap="wrap">
                                <Tag color="green">
                                  View Count {i.viewCount}
                                </Tag>
                                <Tag color="blue">
                                  Click Count {i.clickCount}
                                </Tag>
                              </Flex>
                            </Card>
                          </Badge.Ribbon>
                        </Col>
                      </SortableItem>
                    ))}
                  </Row>
                </SortableList>
              </Row>
            </SortableItem>
          ))}
        </SortableList>
        {/* {adList.map((ea) => (
          <Row
            style={{
              border: "1px solid #e8e8e8",
              padding: "5px",
              backgroundColor: "red",
              margin: "5px 0px",
            }}
          >
            <Divider orientation="left">Ad List {ea.sequence}</Divider>
            <SortableList
              onSortEnd={(oldIndex, newIndex) =>
                onSortEnd(oldIndex, newIndex, ea)
              }
              className="list"
              draggedItemClassName="dragged"
            >
              <Row gutter={16}>
                {ea.AdsItems.map((i) => (
                  <SortableItem key={i.id}>
                    <Col>
                      <Badge.Ribbon
                        text={i.status ? "Active" : "InActive"}
                        color={i.status ? "green" : "red"}
                      >
                        <Card
                          title={i.name}
                          cover={
                            <img
                              alt="example"
                              style={{
                                padding: "0px",
                                height: "120px",
                                objectFit: "cover",
                              }}
                              src={i.imageUrl}
                            />
                          }
                        >
                          <Flex gap="4px 0" wrap="wrap">
                            <Tag color="green">View Count {i.viewCount}</Tag>
                            <Tag color="blue">Click Count {i.clickCount}</Tag>
                          </Flex>
                        </Card>
                      </Badge.Ribbon>
                    </Col>
                  </SortableItem>
                ))}
              </Row>
            </SortableList>
          </Row>
        ))} */}
      </Col>
      <Drawer
        open={showAdListDrawer}
        onClose={() => closeAdList()}
        destroyOnClose="true"
        width={700}
        title={editAd ? "Edit Item list" : "Create Item List"}
      >
        <AdListForm
          closeAdList={closeAdList}
          editAd={editAd}
          loading={loading}
        />
      </Drawer>
      <Drawer
        open={showSequenceDrawer}
        width={700}
        title="AD list Sequence"
        onClose={() => openSequence(false)}
        destroyOnClose="true"
      >
        <AdListSequence closeSequence={closeSequence} />
      </Drawer>
      <Drawer
        styles={{ body: { paddingBottom: "100px", overflow: "hidden" } }}
        closable={false}
        onClose={closeItemList}
        open={showItemDrawer}
        placement="bottom"
        destroyOnClose
        push={false}
        height="90vh"
      >
        <ADItemList
          selectList={itemList}
          open={openAdItemDrawer}
          close={closeAdItemDrawer}
        />
      </Drawer>
    </Row>
  );
}
