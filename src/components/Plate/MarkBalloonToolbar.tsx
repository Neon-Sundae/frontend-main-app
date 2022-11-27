import React from 'react';
import { TippyProps } from '@tippyjs/react';
import {
  BalloonToolbar,
  getPluginType,
  MARK_BOLD,
  MARK_ITALIC,
  MARK_UNDERLINE,
  MarkToolbarButton,
} from '@udecode/plate';
import { useMyPlateEditorRef } from './plateTypes';

const MarkBalloonToolbar = () => {
  const editor = useMyPlateEditorRef();

  const arrow = false;
  const theme = 'dark';
  const tooltip: TippyProps = {
    arrow: true,
    delay: 0,
    duration: [200, 0],
    hideOnClick: false,
    offset: [0, 17],
    placement: 'top',
  };

  const boldTooltip: TippyProps = { content: 'Bold (⌘B)', ...tooltip };
  const italicTooltip: TippyProps = { content: 'Italic (⌘I)', ...tooltip };
  const underlineTooltip: TippyProps = {
    content: 'Underline (⌘U)',
    ...tooltip,
  };

  return (
    <BalloonToolbar theme={theme} arrow={arrow}>
      <MarkToolbarButton
        type={getPluginType(editor, MARK_BOLD)}
        icon="b"
        tooltip={boldTooltip}
      />
      <MarkToolbarButton
        type={getPluginType(editor, MARK_ITALIC)}
        icon="i"
        tooltip={italicTooltip}
      />
      <MarkToolbarButton
        type={getPluginType(editor, MARK_UNDERLINE)}
        icon="u"
        tooltip={underlineTooltip}
      />
    </BalloonToolbar>
  );
};

export default MarkBalloonToolbar;
