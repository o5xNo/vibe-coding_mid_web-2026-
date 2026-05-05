const ProfileSection = () => {
  return (
    <>
      <h2>個人簡介</h2>
      <div className="profile-grid">
        <div className="profile-item">
          <strong>姓名</strong>
          <span>吳丞恩</span>
        </div>
        <div className="profile-item">
          <strong>來自</strong>
          <span>雲林</span>
        </div>
        <div className="profile-item">
          <strong>興趣</strong>
          <span>打遊戲</span>
        </div>
        <div className="profile-item">
          <strong>求學軌跡</strong>
          <span>
            飛沙國小 / 飛沙國中 / 文生高中 / 金門大學 (目前) / 雲林科技大學資工所 (未來)
          </span>
        </div>
      </div>
    </>
  );
};

export default ProfileSection;
