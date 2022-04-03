import styled from 'styled-components';

const OuterBackground = styled.div`
  width: 100%;

  flex: 2;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  box-sizing: border-box;

  background-color: #fff;
  position: relative;
`;

const BorderGroundWrapper = styled.div`
  display: flex;
`;

const BorderGround = styled.div`
  width: 50%;
  height: 80px;
  background-color: #e8e6f2;
`;

const BorderGroundLeft = styled(BorderGround)`
  border-top-right-radius: 100px;
`;

const BorderGroundRight = styled(BorderGround)`
  border-top-left-radius: 100px;
`;

const ContentWrapper = styled.div`
  flex: 1;

  padding: 32px 16px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

type BackgroundProps = {
  children: React.ReactNode;
};

export default function Background({ children }: BackgroundProps) {
  return (
    <OuterBackground>
      <ContentWrapper>{children}</ContentWrapper>

      <BorderGroundWrapper>
        <BorderGroundLeft />
        <BorderGroundRight />
      </BorderGroundWrapper>
    </OuterBackground>
  );
}
