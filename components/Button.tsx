import type { Url } from 'next/dist/shared/lib/router/router';
import Link from 'next/link';
import type { MouseEventHandler, PropsWithChildren } from 'react';

export function Button(
  props: PropsWithChildren<{
    href?: Url;
    onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  }>
) {
  if (props.href) {
    return (
      <Link
        href={props.href}
        onClick={props.onClick}
        className="bg-blue-600 shadow transition-colors hover:bg-blue-500 active:bg-blue-400 active:transition-none px-4 py-2 rounded"
      >
        {props.children}
      </Link>
    );
  }

  return (
    <button
      onClick={props.onClick}
      className="bg-blue-600 shadow transition-colors hover:bg-blue-500 active:bg-blue-400 active:transition-none px-4 py-2 rounded"
    >
      {props.children}
    </button>
  );
}
