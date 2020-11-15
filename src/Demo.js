import React, { Component, useState, useMemo, useEffect, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import * as uuid from 'uuid';
import './Demo.css';

import Rect from './Atom/Rect';
import Image from './Atom/Image';
import Text from './Atom/Text';
import Edge from './Atom/Edge';

const RENDER_TYPE = {
  RECT: 'rect',
  IMAGE: 'image',
  TEXT: 'text',
  ARROW: 'arrow',
};

const initialRectangles = [
  {
    type: RENDER_TYPE.RECT,
    x: 10,
    y: 10,
    width: 100,
    height: 100,
    fill: 'red',
    id: uuid.v4(),
  },
  {
    type: RENDER_TYPE.RECT,
    x: 150,
    y: 150,
    width: 100,
    height: 100,
    fill: 'green',
    id: uuid.v4(),
  },
  {
    type: RENDER_TYPE.IMAGE,
    x: 300,
    y: 300,
    width: 100,
    height: 100,
    // fill: 'green',
    src: 'https://konvajs.org/assets/yoda.jpg',
    id: uuid.v4(),
  },
  {
    type: RENDER_TYPE.TEXT,
    x: 200,
    y: 250,
    width: 100,
    height: 100,
    text: 'test',
    fill: 'black',
    fontSize: 20,
    id: uuid.v4(),
  },
  {
    type: RENDER_TYPE.ARROW,
    startX: 400,
    startY: 150,
    endX: 500,
    endY: 250,
    fill: 'black',
    stroke: 'black',
    id: uuid.v4(),
  },
];

const InfoEditor = ({
  info,
  onChange = () => {},
  ...props
}) => {
  const textRef = useRef();
  const [value, setValue] = useState();

  useEffect(() => {
    setValue(info.text);
    if (!info.id) {
      textRef.current.value = '';
    }
  }, [info.id]);

  const handleChange = (e) => {
    setValue(e.target.value);
    onChange({
      ...info,
      text: e.target.value,
    });
  };

  return (
    <textarea
      ref={textRef}
      onChange={handleChange}
      disabled={!info.id}
      {...props}
      value={value}
    />
  )
};

const ColoredRect = () => {
  const [rectangles, setRectangles] = useState(JSON.parse(JSON.stringify(initialRectangles)));
  const [selectedId, setSelected] = useState();
  const [editId, setEditId] = useState();

  const editData = useMemo(() => {
    if (editId) {
      return ((rectangles || []).find(r => r.id === editId) || {});
    }
    return {};
  }, [editId]);

  const checkDeselect = (e) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelected(null);
      setEditId(null);
    }
  };

  const onInfoChange = (value) => {
    if (editId) {
      rectangles.forEach((r, i) => {
        if (r.id === editId) {
          const rects = rectangles.slice();
          rects[i] = value;
          setRectangles(rects);
        }
      });
    }
  };

  return (
    <div>
      <div className="functions">
        <InfoEditor
          info={editData}
          onChange={onInfoChange}
        />
      </div>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
      >
        <Layer>
          {
            rectangles.map((rect, i) => {
              switch (rect.type) {
                case RENDER_TYPE.RECT:
                  return (
                    <Rect
                      key={rect.id}
                      isSelected={rect.id === selectedId}
                      onSelect={() => {
                        setSelected(rect.id);
                      }}
                      shapeProps={rect}
                      onChange={(newAttrs) => {
                        const rects = rectangles.slice();
                        rects[i] = newAttrs;
                        setRectangles(rects);
                      }}
                    />
                  );
                case RENDER_TYPE.IMAGE:
                  return (
                    <Image
                      key={rect.id}
                      src={rect.src}
                      isSelected={rect.id === selectedId}
                      onSelect={() => {
                        setSelected(rect.id);
                      }}
                      shapeProps={rect}
                      onChange={(newAttrs) => {
                        const rects = rectangles.slice();
                        rects[i] = newAttrs;
                        setRectangles(rects);
                      }}
                    />
                  );
                case RENDER_TYPE.TEXT:
                  return (
                    <Text
                      key={rect.id}
                      src={rect.src}
                      isSelected={rect.id === selectedId}
                      onSelect={() => {
                        setSelected(rect.id);
                      }}
                      isEdited={rect.id === editId}
                      onEdited={() => {
                        setSelected(rect.id);
                        setEditId(rect.id);
                      }}
                      shapeProps={rect}
                      onChange={(newAttrs) => {
                        const rects = rectangles.slice();
                        rects[i] = newAttrs;
                        setRectangles(rects);
                      }}
                    />
                  );
                case RENDER_TYPE.ARROW:
                  return (
                    <Edge
                      key={rect.id}
                      isSelected={rect.id === selectedId}
                      onSelect={() => {
                        setSelected(rect.id);
                      }}
                      shapeProps={rect}
                      onChange={(newAttrs) => {
                        const rects = rectangles.slice();
                        rects[i] = newAttrs;
                        setRectangles(rects);
                      }}
                    />
                  );
                default:
                  return null;
              }
            })
          }
        </Layer>
      </Stage>
    </div>
  );
};

export default class Demo extends Component {
  render() {
    // Stage is a div container
    // Layer is actual canvas element (so you may have several canvases in the stage)
    // And then we have canvas shapes inside the Layer
    return (
      <ColoredRect />
    );
  }
}