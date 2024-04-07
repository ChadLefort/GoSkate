'use client';

import { Autocomplete, AutocompleteItem } from '@nextui-org/autocomplete';
import { IconSearch } from '@tabler/icons-react';
import { Key, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAsyncList } from '@react-stately/data';

import { searchSpots, Spot } from '@/actions/spot-actions';

export const Search = () => {
  const autocompleteRef = useRef<HTMLInputElement | null>(null);
  const [selected, setSelected] = useState<Key | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();
  const list = useAsyncList<Spot>({
    async load({ filterText }) {
      const data = await searchSpots(filterText);

      return {
        items: data,
      };
    },
  });

  const handleSelection = (key: Key | null) => {
    setSelected(key);

    // Clicking on the item should redirect to the spot page
    if (!submitted && key) {
      router.push(`/spots/${key}`);
      autocompleteRef.current?.blur();
    }
  };

  useEffect(() => {
    // The user has submitted the search with enter key on a selected item
    if (selected && submitted) {
      router.push(`/spots/${selected}`);
      setSubmitted(false);
      list.setFilterText('');
      autocompleteRef.current?.blur();
    }

    // The user has submitted the search with enter key on a custom value
    if (!selected && submitted) {
      router.push(`/spots?search=${list.filterText}`);
      setSubmitted(false);
      list.setFilterText('');
      autocompleteRef.current?.blur();
    }
  }, [submitted, selected, router, list]);

  return (
    <Autocomplete
      ref={autocompleteRef}
      radius="full"
      aria-label="Search"
      labelPlacement="outside"
      placeholder="Search Spots"
      allowsCustomValue
      disableAnimation
      inputValue={list.filterText}
      isLoading={list.isLoading}
      items={list.items}
      onInputChange={list.setFilterText}
      onSelectionChange={handleSelection}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onKeyDown={(event: any) => {
        event.continuePropagation();

        if (event.key === 'Enter') {
          setSubmitted(true);
        }
      }}
      startContent={
        <IconSearch className="text-default-400" strokeWidth={2.5} size={20} />
      }
      classNames={{
        selectorButton: 'hidden',
      }}
    >
      {(item) => (
        <AutocompleteItem
          key={item.slug}
          textValue={item.name}
          hideSelectedIcon
        >
          <span className="text-small">{item.name}</span>
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
};
