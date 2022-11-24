type LineProps = {
  left: React.MutableRefObject<HTMLButtonElement>;
  right: React.MutableRefObject<HTMLButtonElement>;
  parent: React.MutableRefObject<HTMLDivElement | null>;
};

export const Line = (props: LineProps) => {
  const { left, right, parent } = props;

  if (!left.current || !right.current || !parent.current) {
    return null;
  }

  const leftRec = left.current.getBoundingClientRect();
  const rightRec = right.current.getBoundingClientRect();
  const parentRec = parent.current.getBoundingClientRect();

  const leftCenterPoint = {
    x: leftRec.x + leftRec.width / 2,
    y: leftRec.y + leftRec.height / 2,
  };

  const rightCenterPoint = {
    x: rightRec.x,
    y: rightRec.y + rightRec.height / 2,
  };

  let styles = {};

  const width = Math.abs(rightCenterPoint.x - leftCenterPoint.x);
  const height = Math.abs(rightCenterPoint.y - leftCenterPoint.y);

  // left below right -> left + top borders
  if (leftCenterPoint.y > rightCenterPoint.y) {
    styles = {
      top: rightCenterPoint.y - parentRec.y,
      left: leftCenterPoint.x - parentRec.x,
      borderTop: '2px solid #40454D',
      borderLeft: '2px solid #40454D',
      borderTopLeftRadius: '20px',
    };
  } else {
    // bottom + right borders
    styles = {
      top: leftCenterPoint.y - parentRec.y,
      left: leftCenterPoint.x - parentRec.x,
      borderLeft: '2px solid #40454D',
      borderBottom: '2px solid #40454D',
      borderBottomLeftRadius: '20px',
    };
  }

  return (
    <div
      style={{
        position: 'absolute',
        width,
        height,
        zIndex: 0,
        ...styles,
      }}
    />
  );
};
