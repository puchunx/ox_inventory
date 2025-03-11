import { Locale } from '../../store/locale';
import React, { useEffect, useRef, useState } from 'react';
import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useDismiss,
  useFloating,
  useInteractions,
  useTransitionStyles,
} from '@floating-ui/react';
import { ColorInput, Slider } from '@mantine/core';
import { useAppDispatch, useAppSelector } from '../../store';
import { resetColors, setColor, setOpacity } from '../../store/colors';
import { fetchNui } from '../../utils/fetchNui';
import { Colors } from '../../typings';

interface Props {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const UsefulControls: React.FC<Props> = ({ visible, setVisible }) => {
  const { mainColor, textColor, backgroundColor, opacity } = useAppSelector((state) => state.colors);
  const dispatch = useAppDispatch();

  const colorsRef = useRef<Partial<Colors>>({});

  const { refs, context } = useFloating({
    open: visible,
    onOpenChange: setVisible,
  });

  const dismiss = useDismiss(context, {
    outsidePressEvent: 'mousedown',
  });

  const { isMounted, styles } = useTransitionStyles(context);

  const { getFloatingProps } = useInteractions([dismiss]);

  const saveColors = () => {
    fetchNui('saveColors', colorsRef.current);
  };

  useEffect(() => {
    colorsRef.current = { mainColor, textColor, backgroundColor, opacity };
  }, [mainColor, textColor, backgroundColor, opacity]);

  return (
    <>
      {isMounted && (
        <FloatingPortal>
          <FloatingOverlay lockScroll className="action-dialog-overlay" data-open={visible} style={styles}>
            <FloatingFocusManager context={context}>
              <div ref={refs.setFloating} {...getFloatingProps()} className="action-dialog" style={styles}>
                <div className="action-dialog-title">
                  <p>{Locale.ui_colorsettings || 'Color settings'}</p>
                  <div className="action-dialog-close" onClick={() => setVisible(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 400 528">
                      <path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" />
                    </svg>
                  </div>
                </div>
                <div className="action-content-wrapper">
                  <div>
                    <p>{Locale.ui_opacity || 'Opacity'}</p>
                    <Slider
                      value={opacity}
                      min={0}
                      max={100}
                      size="md"
                      onChange={(value) => dispatch(setOpacity(value))}
                      onChangeEnd={() => setTimeout(saveColors, 100)}
                    />
                  </div>
                  <div>
                    <p>{Locale.ui_backgroundcolor || 'Background color'}</p>
                    <ColorInput
                      disallowInput
                      withEyeDropper={false}
                      value={backgroundColor}
                      variant="unstyled"
                      radius="md"
                      size="md"
                      format="hex"
                      onChange={(color) => dispatch(setColor({ label: 'backgroundColor', value: color }))}
                      onChangeEnd={() => setTimeout(saveColors, 100)}
                    />
                  </div>
                  <div>
                    <p>{Locale.ui_maincolor || 'Main color'}</p>
                    <ColorInput
                      disallowInput
                      withEyeDropper={false}
                      value={mainColor}
                      autoFocus={false}
                      variant="unstyled"
                      radius="md"
                      size="md"
                      format="hex"
                      onChange={(color) => dispatch(setColor({ label: 'mainColor', value: color }))}
                      onChangeEnd={() => setTimeout(saveColors, 100)}
                    />
                  </div>
                  <div>
                    <p>{Locale.ui_textcolor || 'Text color'}</p>
                    <ColorInput
                      disallowInput
                      withEyeDropper={false}
                      value={textColor}
                      variant="unstyled"
                      radius="md"
                      size="md"
                      format="hex"
                      onChange={(color) => dispatch(setColor({ label: 'textColor', value: color }))}
                      onChangeEnd={() => setTimeout(saveColors, 100)}
                    />
                  </div>
                  <div className="action-dialog-submit-wrapper">
                    <div
                      className="action-dialog-submit"
                      onClick={() => {
                        dispatch(resetColors());
                        setTimeout(saveColors, 100);
                      }}
                    >
                      <p>{Locale.ui_reset || 'Reset'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        </FloatingPortal>
      )}
    </>
  );
};

export default UsefulControls;
