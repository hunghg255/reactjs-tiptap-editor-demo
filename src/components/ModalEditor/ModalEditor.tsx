import React from 'react';

import styles from './index.module.scss';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Editor from '@/components/Editor/Editor';

const ModalEditor = () => {
  return <div className={styles.containerModalEditor}>
    <Dialog>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogTitle>Editor</DialogTitle>
       AAAA
      </DialogContent>
    </Dialog>
  </div>
};

export default ModalEditor;
