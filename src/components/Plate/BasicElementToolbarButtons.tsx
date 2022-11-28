import React from 'react';

import {
  BlockToolbarButton,
  CodeBlockToolbarButton,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
  useEventPlateId,
  ELEMENT_OL,
  ELEMENT_UL,
  getPluginType,
  ListToolbarButton,
  MARK_BOLD,
  MARK_ITALIC,
  MarkToolbarButton,
} from '@udecode/plate';
import { ReactComponent as HeadingOne } from 'assets/illustrations/icons/plate/heading1.svg';
import { ReactComponent as HeadingTwo } from 'assets/illustrations/icons/plate/heading2.svg';
import { ReactComponent as Italic } from 'assets/illustrations/icons/plate/italic.svg';
import { ReactComponent as List } from 'assets/illustrations/icons/plate/list.svg';
import { ReactComponent as Bold } from 'assets/illustrations/icons/plate/bold.svg';
import { useMyPlateEditorRef } from './plateTypes';

const BasicElementToolbarButtons = () => {
  const editor = useMyPlateEditorRef(useEventPlateId());
  return (
    <>
      <BlockToolbarButton
        type={getPluginType(editor, ELEMENT_H1)}
        icon={
          <HeadingOne
            style={{ width: '24px', height: '24px', marginRight: '7px' }}
          />
        }
      />
      <BlockToolbarButton
        type={getPluginType(editor, ELEMENT_H2)}
        icon={
          <HeadingTwo
            style={{ width: '24px', height: '24px', marginRight: '7px' }}
          />
        }
      />
      <ListToolbarButton
        type={getPluginType(editor, ELEMENT_UL)}
        icon={
          <List style={{ width: '24px', height: '24px', marginRight: '7px' }} />
        }
      />
      <MarkToolbarButton
        type={getPluginType(editor, MARK_BOLD)}
        icon={
          <Bold style={{ width: '24px', height: '24px', marginRight: '7px' }} />
        }
      />
      <MarkToolbarButton
        type={getPluginType(editor, MARK_ITALIC)}
        icon={<Italic style={{ width: '24px', height: '24px' }} />}
      />
    </>
  );
};
export default BasicElementToolbarButtons;
