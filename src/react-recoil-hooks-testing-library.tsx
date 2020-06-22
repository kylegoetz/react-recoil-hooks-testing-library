import React, { useEffect } from 'react';
import { act, renderHook } from 'react-hooks-testing-library';
import { RecoilRoot, RecoilState, useSetRecoilState } from 'recoil';

export { act };

interface MockRecoilState {
  recoilState: RecoilState<any>;
  initialValue: any;
}

interface SetMockRecoilStateOptions {
  states?: MockRecoilState[];
  wrapper?: React.ComponentType;
}

function recoilStateWrapper(options?: SetMockRecoilStateOptions) {
  const StateComponent: React.FC<MockRecoilState> = (
    props: MockRecoilState,
  ) => {
    const setState = useSetRecoilState(props.recoilState);
    useEffect(() => {
      setState(props.initialValue);
    }, []);

    return null;
  };

  const renderStateComponents = () => {
    return options?.states?.map(state => (
      <StateComponent key={state.recoilState.key} {...state} />
    ));
  };

  return ({ children }: { children?: React.ReactNode }) => {
    const renderChildren = options?.wrapper ? (
      <options.wrapper>{children}</options.wrapper>
    ) : (
      children
    );

    return (
      <RecoilRoot>
        {renderStateComponents()}
        {renderChildren}
      </RecoilRoot>
    );
  };
}

function renderRecoilHook<P, R>(
  callback: (props: P) => R,
  options?: SetMockRecoilStateOptions & {
    initialProps?: P;
    wrapper?: React.ComponentType;
  },
): {
  readonly result: {
    readonly current: R;
    readonly error: Error;
  };
  readonly waitForNextUpdate: () => Promise<void>;
  readonly unmount: () => boolean;
  readonly rerender: (hookProps?: P) => void;
} {
  return renderHook(callback, {
    ...options,
    wrapper: recoilStateWrapper({
      states: options?.states,
      wrapper: options?.wrapper,
    }),
  });
}

export { renderRecoilHook };
