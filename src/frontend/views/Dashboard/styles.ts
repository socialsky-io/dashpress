import { BREAKPOINTS } from "frontend/design-system/constants";
import { WidgetSizes } from "shared/types/dashboard/types";
import styled, { css } from "styled-components";

export const gridRoot = css`
  width: 97%;
  user-select: none;
  display: grid;
  grid-gap: 16px;
  grid-template-columns: repeat(4, 25%);
  grid-auto-rows: minmax(130px, auto);
  @media (max-width: ${BREAKPOINTS.lg}) {
    grid-template-columns: repeat(2, 50%);
  }
  @media (max-width: ${BREAKPOINTS.sm}) {
    grid-template-columns: 100%;
  }
`;

const WIDGET_SIZE_CONFIG: Record<
  WidgetSizes,
  { lg: number; sm: number; xl: number }
> = {
  "1": {
    sm: 1,
    lg: 1,
    xl: 1,
  },
  "2": {
    sm: 1,
    lg: 2,
    xl: 2,
  },
  "3": {
    sm: 1,
    lg: 2,
    xl: 3,
  },
  "4": {
    sm: 1,
    lg: 2,
    xl: 4,
  },
};

export const WidgetRoot = styled.div<{
  hasSetting: boolean;
  $size: WidgetSizes;
  $height: string;
}>`
  ${(props) =>
    props.hasSetting &&
    css`
      cursor: grab;
      user-select: none;
    `}
  grid-column-start: span ${(props) => WIDGET_SIZE_CONFIG[props.$size].xl};
  grid-row-start: span ${(props) => props.$height};

  @media (max-width: ${BREAKPOINTS.lg}) {
    grid-column-start: span ${(props) => WIDGET_SIZE_CONFIG[props.$size].lg};
  }
  @media (max-width: ${BREAKPOINTS.sm}) {
    grid-column-start: span ${(props) => WIDGET_SIZE_CONFIG[props.$size].sm};
  }
`;
