import React, { useRef, useEffect } from 'react';
import { Arrow, Transformer } from 'react-konva';
// import Konva from 'konva';

const EdgeObject = ({
  isSelected,
  onSelect,
  onChange,
  shapeProps,
  ...props
}) => {
  const shapeRef = useRef();
  const trRef = useRef();

  // const [isSelected, setSelected] = useState(false);

  useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  // const onSelect = () => {
  //   setSelected(true);
  // };

  return (
    <>
      <Arrow
        ref={shapeRef}
        onClick={onSelect}
        onTap={onSelect}
        onTransformEnd={(e) => {
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // we will reset it back
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            // set minimal value
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
        }}
        points={[shapeProps.startY, shapeProps.startY, shapeProps.endY, shapeProps.endY]}
        shadowBlur={5}
        draggable
        {...shapeProps}
        {...props}
      />
      {
        isSelected && (
          <Transformer
            ref={trRef}
            boundBoxFunc={(oldBox, newBox) => {
              // limit resize
              if (newBox.width < 5 || newBox.height < 5) {
                return oldBox;
              }
              return newBox;
            }}
          />
        )
      }
    </>
  );
};

export default EdgeObject;
