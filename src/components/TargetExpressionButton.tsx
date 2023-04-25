import useLoopsStore, { TARGETS_EXPRESSIONS } from "@stores/LoopAudio";
import cx from "classnames";

export interface Props {
  expression: TARGETS_EXPRESSIONS;
  emoji: string;
}

export function TargetExpressionButton(props: Props) {
  const [targetExpression, setTargetExpression] = useLoopsStore((state) => [
    state.targetExpression,
    state.setTargetExpression,
  ]);

  function handleSelectExpression() {
    setTargetExpression(props.expression);
  }

  return (
    <button
      className={cx("hover:opacity-100 transition-all", {
        "text-3xl": targetExpression === props.expression,
        "opacity-50 text-2xl": targetExpression !== props.expression,
      })}
      onClick={handleSelectExpression}
    >
      <span>{props.emoji}</span>
    </button>
  );
}
