'use client';

import { Autocomplete, AutocompleteItem } from '@nextui-org/autocomplete';
import { IconSearch } from '@tabler/icons-react';
import { type Key, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAsyncList } from '@react-stately/data';

import { searchSpots } from '@/actions/spot-actions';
import type { Spot } from '@/types/spot';

export const Search = () => {
  const autocompleteRef = useRef<HTMLInputElement | null>(null);
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

  const handleInput = (value: string) => {
    if (!value) {
      router.push('/spots');
    }

    list.setFilterText(value);
  };

  const handleSelection = (key: Key | null) => {
    if (!key) {
      router.push('/spots');
    }

    if (key && !submitted) {
      list.setFilterText(list.items.find((item) => item.slug === key)?.name || '');

      autocompleteRef.current?.blur();
      router.push(`/spots/${key}`);
    }
  };

  useEffect(() => {
    if (submitted) {
      autocompleteRef.current?.blur();
      setSubmitted(false);

      const selectedSpot = list.items.find((item) => item.name === list.filterText);

      if (selectedSpot) {
        router.push(`/spots/${selectedSpot.slug}`);
      } else {
        router.push(`/spots?search=${list.filterText}`);
      }
    }
  }, [submitted, router, list]);

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
      onInputChange={handleInput}
      onSelectionChange={handleSelection}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onKeyDown={(event: any) => {
        event.continuePropagation();

        if (event.key === 'Enter') {
          setSubmitted(true);
        }
      }}
      startContent={<IconSearch className="text-default-400" strokeWidth={2.5} size={20} />}
      classNames={{
        selectorButton: 'hidden',
      }}
    >
      {(item) => (
        <AutocompleteItem key={item.slug} textValue={item.name} hideSelectedIcon>
          <span className="text-small">{item.name}</span>
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
};
