import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import styles from '@/styles/components/_selector-list-box.module.scss';

const TRANSITION_CLASSES = {
  enter: styles.enter,
  enterFrom: styles.enterFrom,
  enterTo: styles.enterTo,
  leave: styles.leave,
  leaveFrom: styles.leaveFrom,
  leaveTo: styles.leaveTo,
};

const SelectorListBox = (props: {
  selectedData: { value: string; label: string };
  setSelectedData: (data: { value: string; label: string }) => void;
  dataList: { value: string; label: string }[];
}) => {
  return (
    <div className={styles.list}>
      <Listbox value={props.selectedData} onChange={props.setSelectedData}>
        <Listbox.Label className={styles.list__label_title}>性別</Listbox.Label>
        <Listbox.Button className={styles.list__btn}>
          <span>{props.selectedData.label}</span>
          <span className={styles.list__chevron_icon}>
            <ChevronUpDownIcon aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition as={Fragment} {...TRANSITION_CLASSES}>
          <Listbox.Options className={styles.list__options}>
            {props.dataList.map((data, index) => (
              <Listbox.Option as={Fragment} key={index} value={data}>
                {({ active, selected }) => (
                  <li
                    className={`${styles.list__item} ${
                      active && styles.list__item_active
                    }`}
                  >
                    {selected && (
                      <CheckIcon className={styles.list__selected_icon} />
                    )}
                    <span
                      className={`${styles.list__label} ${
                        selected && styles.list__label_selected
                      }`}
                    >
                      {data.label}
                    </span>
                  </li>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </Listbox>
    </div>
  );
};

export default SelectorListBox;